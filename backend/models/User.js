// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['user', 'washerman'], default: 'user' },
  isApproved: { type: Boolean, default: true }, // washerman will be false by default
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isVerified: {
    type: Boolean,
    default: true
  }

});

export default mongoose.model('User', userSchema);
