// GET /api/washermen/my-orders - get all orders for the logged-in washerman
import Order from '../models/Order.js';
import User from '../models/User.js';
import sendStatusEmail from '../utils/sendStatusEmail.js';

export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filters
    const query = {
      washerman: req.user._id,
      paymentStatus: { $in: ['paid', 'unpaid'] },
    };
    // Email filter (user email)
    if (req.query.email) {
      const user = await User.findOne({ email: { $regex: req.query.email, $options: 'i' } });
      if (user) query.user = user._id;
      else query.user = null;
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
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
export const washermanOnly = (req, res, next) => {
  if (req.user && req.user.role === 'washerman') return next();
  res.status(403).json({ message: 'washerman access required' });
};

export const updatePricing  = async (req, res) => {
  const { id } = req.params;
  const { pricing } = req.body;

  try {
    const user = await User.findById(id);
    if (!user || user.role !== 'washerman') {
      return res.status(404).json({ message: 'Washerman not found' });
    }

    user.pricing = pricing;
    await user.save();

    res.status(200).json({ message: 'Pricing updated successfully', pricing: user.pricing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating pricing' });
  }
};

// GET /api/washermen/:id/pricing - get pricing for a washerman
export const getPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const washerman = await User.findById(id);
    if (!washerman || washerman.role !== 'washerman') {
      return res.status(404).json({ message: 'Washerman not found' });
    }
    res.json({ pricing: washerman.pricing });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pricing' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findOne({ _id: orderId, washerman: req.user._id });
    const userOftheOrder = await User.findById(order.user);
    if (!userOftheOrder) return res.status(404).json({ message: 'User not found' });
    const washerman = await User.findById(req.user._id);
    if (!userOftheOrder || !washerman) {
      return res.status(404).json({ message: 'User or washerman not found' });
    }
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
    // Send email notification to user
    const user = await User.findById(order.user);
    if (user) {
      await sendStatusEmail(user.email, order,userOftheOrder,washerman, status);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
