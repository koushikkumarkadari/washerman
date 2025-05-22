import Order from '../models/Order.js';
import User from '../models/User.js';

export const allWasherman=async (req, res) => {
  try {
    const washermen = await User.find({ role: 'washerman'});
    res.json(washermen);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch washermen' });
  }
};


export const getApproved= async (req, res) => {
  try {
    const washerman = await User.findById(req.params.id);
    if (!washerman || washerman.role !== 'washerman') {
      return res.status(404).json({ message: 'Washerman not found' });
    }
    console.log('Washerman:', washerman);
    console.log(req.body);
    washerman.isApproved = req.body.isApproved;
    await washerman.save();
    res.json({ message: 'Approval status updated', washerman });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update approval status' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user',isAdmin:false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Add adminOnly middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'user' && req.user.isAdmin===true) return next();
  res.status(403).json({ message: 'Admin access required' });
};

export const getAllOrders = async (req, res) => {
  try {
    console.log('Fetching all orders');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate('user', 'firstName lastName email')
        .populate('washerman', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments()
    ]);

    res.json({ orders, total });
    console.log('Orders:', orders);
    console.log('Total Orders:', total);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};