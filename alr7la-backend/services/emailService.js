const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const transporter = require("../config/mailConfig");

async function sendOtpEmail(email, otp, user = {}) {
  const templatePath = path.join(__dirname, "../templates/otpTemplate.html");
  const template = fs.readFileSync(templatePath, "utf8");

  const currentYear = new Date().getFullYear();
  const html = mustache.render(template, {
    name: user.name,
    otp,
    year: currentYear,
  });

  const mailOptions = {
    from: "alr7la.travel@gmail.com",
    to: email,
    subject: "Your OTP for password reset",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending OTP email");
  }
}

module.exports = { sendOtpEmail };