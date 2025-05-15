// backend/routes/authRoutes.js
import express from 'express';
import { signup, login ,sendOtp,verifyOtp} from '../controllers/authControllers.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/send-otp', sendOtp);
authRoutes.post('/verify-otp', verifyOtp);

export default authRoutes;
