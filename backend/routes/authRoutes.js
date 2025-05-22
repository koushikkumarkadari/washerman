// backend/routes/router.js
import express from 'express';
import {
  signup,
  login,
  sendOtp,
  verifyOtp,
  forgotPasswordSendOtp,
  forgotPasswordVerifyOtp,
  forgotPasswordReset,
} from '../controllers/authControllers.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password/send-otp', forgotPasswordSendOtp);
router.post('/forgot-password/verify-otp', forgotPasswordVerifyOtp);
router.post('/forgot-password/reset', forgotPasswordReset);

export default router;
