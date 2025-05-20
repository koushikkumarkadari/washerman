import express from 'express';
import { allWasherman, createOrder, getMyOrders } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const userrouter = express.Router();

// GET /api/washermen - fetch all washermen
userrouter.get('/', protect, allWasherman);
// Create order for a washerman
userrouter.post('/:id/order', protect, createOrder);
// Get all orders for a user
userrouter.get('/my', protect, getMyOrders);

export default userrouter;