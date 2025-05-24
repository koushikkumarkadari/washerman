import Razorpay from 'razorpay';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const options = {
      amount: order.total * 100, // amount in paise
      currency: 'INR',
      receipt: orderId,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      order: orderId,
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.total,
      status: 'created',
    });
    await payment.save();

    res.json({ razorpayOrderId: razorpayOrder.id, amount: order.total, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

// Verify payment and update status
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    // Optionally, verify signature here using Razorpay's utility
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
      },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Optionally, update order status to "paid"
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });

    res.json({ message: 'Payment successful', payment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};