import Order from '../models/Order.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';

// GET /api/user/washermen - fetch all washermen
export const getApprovedWasherman = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [washermen, total] = await Promise.all([
      User.find({ role: 'washerman', isApproved: true })
        .skip(skip)
        .limit(limit),
      User.countDocuments({ role: 'washerman', isApproved: true })
    ]);
    res.json({ washermen, total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch washermen' });
  }
};

// POST /api/user/washermen/:id/order - create a new order
export const createOrder = async (req, res) => {
  try {
    const washermanId = req.params.id;
    const { items, total } = req.body;
    const userId = req.user._id;

    // Optional: Validate washerman exists and is a washerman
    const washerman = await User.findById(washermanId);
    if (!washerman || washerman.role !== 'washerman') {
      return res.status(400).json({ message: 'Invalid washerman' });
    }

    const order = new Order({
      user: userId,
      washerman: washermanId,
      items,
      total
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
};
// GET /api/orders/my - get all orders for the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filters
    const query = {
      user: req.user._id,
      paymentStatus: { $in: ['paid', 'unpaid'] },
    };

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
        .populate('washerman', 'firstName lastName email')
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

// POST /api/user/washermen/feedback - save feedback from contact form
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

