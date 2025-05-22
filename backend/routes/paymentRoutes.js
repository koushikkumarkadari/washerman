import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentControllers.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-order', protect, createRazorpayOrder);
paymentRouter.post('/verify', protect, verifyPayment);

export default paymentRouter;