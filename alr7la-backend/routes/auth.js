const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', authController.login);
router.post('/', authController.post);
router.post('/refreshToken', authController.refreshToken);
router.post('/send-otp/:email', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtpAndUpdatePassword);

module.exports = router;
