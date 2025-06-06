import express from 'express';
import { getOrders, washermanOnly, updatePricing, getPricing, updateOrderStatus, updatePaymentStatus, bulkUpdateOrderStatus } from '../controllers/washermanControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const washermanrouter = express.Router();

washermanrouter.get('/my-orders', protect, washermanOnly, getOrders);
washermanrouter.patch('/:id/pricing', protect, washermanOnly, updatePricing);
washermanrouter.get('/:id/pricing', protect, getPricing); // <-- Add this line
washermanrouter.patch('/order/:orderId/status', protect, washermanOnly, updateOrderStatus);
washermanrouter.patch('/order/:orderId/payment-status', protect, washermanOnly, updatePaymentStatus);
washermanrouter.patch('/bulk-update-status', protect, washermanOnly, bulkUpdateOrderStatus);

export default washermanrouter;