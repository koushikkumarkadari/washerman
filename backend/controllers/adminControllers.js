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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filters
    const query = {};
    // Email filter (user email)
    if (req.query.email) {
      // Find user by email
      const user = await User.findOne({ email: { $regex: req.query.email, $options: 'i' } });
      if (user) query.user = user._id;
      else query.user = null; // No match, so no orders
    }
    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      query.createdAt = {};
      if (req.query.dateFrom) query.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) query.createdAt.$lte = new Date(req.query.dateTo + 'T23:59:59.999Z');
    }
    // Order total filter
    if (req.query.totalMin) query.total = { ...query.total, $gte: Number(req.query.totalMin) };
    if (req.query.totalMax) query.total = { ...query.total, $lte: Number(req.query.totalMax) };

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'oldest') sort = { createdAt: 1 };
    if (req.query.sort === 'totalLowHigh') sort = { total: 1 };
    if (req.query.sort === 'totalHighLow') sort = { total: -1 };

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'firstName lastName email')
        .populate('washerman', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};