// GET /api/washermen/my-orders - get all orders for the logged-in washerman
import Order from '../models/Order.js';

export const getOrders =async (req, res) => {
  try {
    console.log('Fetching orders for washerman:', req.user._id);
    const orders = await Order.find({ washerman: req.user._id })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
export const washermanOnly = (req, res, next) => {
  if (req.user && req.user.role === 'washerman') return next();
  res.status(403).json({ message: 'washerman access required' });
};
