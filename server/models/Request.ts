import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Request document
interface IRequest extends Document {
  studentId: string;
  items: string;
  status: 'Pending' | 'Processing' | 'Completed';
  paymentStatus: 'Unpaid' | 'Paid';
  createdAt: Date;
}

const requestSchema: Schema = new Schema({
  studentId: {
    type: String,
    required: true,
  },
  items: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IRequest>('Request', requestSchema);