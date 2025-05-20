import Order from '../models/Order.js';
import User from '../models/User.js'; // Adjust path if needed

// GET /api/washermen - fetch all washermen
export const allWasherman=async (req, res) => {
  try {
    const washermen = await User.find({ role: 'washerman' });
    res.json(washermen);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch washermen' });
  }
};

// POST /api/washermen/:id/order - create a new order
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

