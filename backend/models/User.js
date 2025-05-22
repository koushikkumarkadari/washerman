// backend/models/User.js
import mongoose from 'mongoose';

const clothTypes = [
  'Shirts', 'Pants', 'Nightpants', 'T-Shirts', 'Hoodies', 'Neckars',
  '3/4 Shorts', 'Blanket', 'Bedsheet', 'Towel', 'Underwears', 'Banians', 'Socks'
];

const defaultPricing = {};
clothTypes.forEach(item => {
  defaultPricing[item] = { washing: 10, ironing: 5 };
});

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
  },
  pricing: {
    type: Map,
    of: {
      washing: { type: Number, default: 10 },
      ironing: { type: Number, default: 5 }
    },
    default: defaultPricing
  }

});

export default mongoose.model('User', userSchema);
