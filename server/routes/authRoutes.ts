import express from 'express';
import { signup, verifyOTP, login, requestPasswordChange, changePassword } from '../controllers/authController';

const router = express.Router();

// Signup routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);

// Login route
router.post('/login', login);

// Password change routes
router.post('/request-password-change', requestPasswordChange);
router.post('/change-password', changePassword);

export default router;