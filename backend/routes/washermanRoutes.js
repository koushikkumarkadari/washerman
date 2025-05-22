import express from 'express';
import { getOrders, washermanOnly, updatePricing, getPricing, updateOrderStatus } from '../controllers/washermanControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const washermanrouter = express.Router();

washermanrouter.get('/my-orders', protect, washermanOnly, getOrders);
washermanrouter.patch('/:id/pricing', protect, washermanOnly, updatePricing);
washermanrouter.get('/:id/pricing', protect, getPricing); // <-- Add this line
washermanrouter.patch('/order/:orderId/status', protect, washermanOnly, updateOrderStatus);

export default washermanrouter;