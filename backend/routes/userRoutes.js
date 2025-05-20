import express from 'express';
import { allWasherman, createOrder } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const userrouter = express.Router();

// GET /api/washermen - fetch all washermen
userrouter.get('/', protect, allWasherman);
// Create order for a washerman
userrouter.post('/:id/order', protect, createOrder);

export default userrouter;