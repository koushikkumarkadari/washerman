// backend/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import client from '../utils/redisClient.js';
import redis from '../utils/redisClient.js'; // If you're using Redis
import sendOtpEmail from '../utils/sendOtpEmail.js';

export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const isApproved = role === 'washerman' ? false : true;

    const user = new User({
      email,
      password: hashed,
      role,
      isApproved,
      isAdmin: false,
      isVerified: false
    });
 
    await user.save();

    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// 👉 OTP sending controller
export const sendOtp = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  console.log(email);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOtpEmail(email, otp);
    await client.set(`otp:${email}`, otp, { EX: 300 }); // 5 min TTL
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtp = await client.get(`otp:${email}`);
    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP expired or not sent' });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await client.del(`otp:${email}`); // Delete OTP after verification
    return res.status(200).json({ message: 'OTP verified successfully', verified: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role === 'washerman' && !user.isApproved) {
      return res.status(403).json({ message: 'Washerman not approved by admin yet' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
    message: 'Login successful',
    token,
    user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        firstName: user.firstName,
        isAdmin: user.isAdmin,
    }
    });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
