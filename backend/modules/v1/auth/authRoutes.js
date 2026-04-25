const express = require('express');
const router = express.Router();

const authController = require('../auth/authControllers');
const { authenticate } = require('../../../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/get-profile', authenticate, authController.getProfile);
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;
