import express from 'express';
import {getOrders,washermanOnly}    from '../controllers/washermanControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const washermanrouter = express.Router();

washermanrouter.get('/my-orders', protect,washermanOnly,getOrders);


export default washermanrouter;