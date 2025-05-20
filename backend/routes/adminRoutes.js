import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getApproved, adminOnly, getAllUsers, getAllOrders } from '../controllers/adminControllers.js';

const adminrouter = express.Router();

adminrouter.patch('/:id/approve', protect, adminOnly, getApproved);
adminrouter.get('/users', protect, adminOnly, getAllUsers);
adminrouter.get('/orders', protect, adminOnly, getAllOrders); // <-- Add this line

// Add other admin routes here
export default adminrouter;