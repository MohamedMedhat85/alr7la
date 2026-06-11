// routes/users.js 
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/users', authenticateToken ,userController.getUsers );

module.exports = router;
