import express from 'express';
import { getApprovedWasherman, createOrder, getMyOrders } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const userrouter = express.Router();

// GET /api/user/washermen - fetch all washermen
userrouter.get('/', protect, getApprovedWasherman);
// Create order for a washerman
userrouter.post('/:id/order', protect, createOrder);
// Get all orders for a user
userrouter.get('/my', protect, getMyOrders);

export default userrouter;