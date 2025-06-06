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

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;
    const order = await Order.findOne({ _id: orderId, washerman: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ message: 'Payment status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};

export const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { status, filters } = req.body;
    // Only allow these two statuses
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // 1. Build the “pre‐update” query based on filters + washerman
    const baseQuery = { washerman: req.user._id };

    // Date filters
    if (filters?.dateFrom || filters?.dateTo) {
      baseQuery.createdAt = {};
      if (filters.dateFrom)  baseQuery.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo)    baseQuery.createdAt.$lte = new Date(filters.dateTo + 'T23:59:59.999Z');
    }

    // Total amount filters
    if (filters?.totalMin) {
      baseQuery.total = { ...baseQuery.total, $gte: Number(filters.totalMin) };
    }
    if (filters?.totalMax) {
      baseQuery.total = { ...baseQuery.total, $lte: Number(filters.totalMax) };
    }

    // Email (user) filter: if an email substring is provided, find that user first
    if (filters?.email) {
      const user = await User.findOne({ email: { $regex: filters.email, $options: 'i' } });
      // If no user matches, we can set user=null so that no orders match (hence no updates/no emails)
      baseQuery.user = user ? user._id : null;
    }

    // 2. Only pick those orders whose current status is NOT already the target status
    baseQuery.status = { $ne: status };

    // 3. Fetch these orders (they all have status != newStatus)
    const ordersToUpdate = await Order.find(baseQuery);

    // If nothing to update, short‐circuit:
    if (ordersToUpdate.length === 0) {
      return res.json({ message: `No orders needed updating to "${status}".` });
    }

    // 4. Perform the bulk update
    const result = await Order.updateMany(
      // same query we just used to fetch
      baseQuery,
      // set status to the new value
      { status }
    );

    // 5. Send emails for each order in ordersToUpdate
    //    We know each one’s old status was ≠ new status, so it changed
    await Promise.all(
      ordersToUpdate.map(async (order) => {
        try {
          const userOfOrder = await User.findById(order.user);
          const washerman   = await User.findById(req.user._id);
          if (userOfOrder && washerman) {
            // Pass “status” (the new status) into your helper
            await sendStatusEmail(
              userOfOrder.email,
              order,           // contains the old order data (you can still read order._id, etc.)
              userOfOrder,
              washerman,
              status           // this is the new status
            );
          }
        } catch (e) {
          console.error(`Failed to send email for order ${order._id}:`, e);
        }
      })
    );

    // 6. Finally, return how many documents were modified
    const updatedCount = result.nModified ?? result.modifiedCount ?? 0;
    res.json({ message: `Updated ${updatedCount} orders to "${status}".` });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Bulk update failed' });
  }
};

