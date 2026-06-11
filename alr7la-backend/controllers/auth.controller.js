const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpService = require("../services/otpService");
const emailService = require("../services/emailService");

// Login function
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await models.Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    const match = await bcrypt.compare(password, user.password);
    console.log(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email, id: user.id }, 'alr7la_el7lwa', { expiresIn: '1d' });
    const refreshToken = jwt.sign({ email: user.email, id: user.id }, 'alr7la_el7lwa', { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token, refreshToken, userId: user.id, profilePicture: user.profile_picture });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
}

async function post(req, res) {
  const { email, password, ...userData } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await models.Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await models.Users.create({
      email,
      password: hashedPassword,
      ...userData
    });

    // Remove sensitive data from response
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

async function sendOtp(req, res) {
  const { email } = req.params;
  try {
    const user = await models.Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = await otpService.generateOtp(user);
    await emailService.sendOtpEmail(email, otp, user);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};


async function verifyOtpAndUpdatePassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await models.Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validation = await otpService.validateOtp(user, otp);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password", error });
  }
}


async function refreshToken(req, res) {
  const refreshToken = req.body.refreshToken;
  // Verify the refresh token
  jwt.verify(refreshToken, "alr7la_el7lwa", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // If the refresh token is valid, generate a new access token
    const email = decoded.email;
    const id = decoded.id;
    const token = jwt.sign({ email: email, id: id }, 'alr7la_el7lwa', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: email, id: id }, 'alr7la_el7lwa', { expiresIn: '7d' });
    return res.status(200).json({ userId, role, token, refreshToken });
  });
}

module.exports = { login, post, verifyOtpAndUpdatePassword, sendOtp, refreshToken };