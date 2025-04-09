import express from 'express';
import { createRequest, getAllRequests, updateRequest } from '../controllers/requestController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Protected routes with auth middleware
router.post('/requests', authMiddleware, createRequest);
router.get('/requests', authMiddleware, getAllRequests);
router.put('/requests/:id', authMiddleware, updateRequest);

export default router;