import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  washerman: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      ironing: { type: Boolean, default: false }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  paymentStatus:{type:String, default:'unpaid'}, // paid, unpaid
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;