const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);

router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);

router.get('/logout', authController.logout);

module.exports = router;