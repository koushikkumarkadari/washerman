import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// In-memory OTP store (use MongoDB/Redis in production)
const otpStore: { [email: string]: string } = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();

// Signup: Send OTP
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, password } = req.body as { email: string; phone: string; password: string };

    if (!email.match(/^[0-9]{5}[a-zA-Z0-9]{5}@bvrit\.ac\.in$/)) {
      res.status(400).json({ message: 'Email must be in format rollno@bvrit.ac.in (e.g., 22211a1251@bvrit.ac.in)' });
      return;
    }

    if (!phone.match(/^[0-9]{10}$/)) {
      res.status(400).json({ message: 'Phone number must be 10 digits' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const otp = generateOTP();
    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Laundry App Signup OTP',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to your email', email, phone, password }); // Temp store in response for simplicity
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Verify OTP for Signup
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, phone, password } = req.body as { email: string; otp: string; phone: string; password: string };

    if (otpStore[email] !== otp) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    delete otpStore[email];

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const newUser = new User({ email, phone, password });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'Signup successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login: Email + Password
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email.match(/^[0-9]{5}[a-zA-Z0-9]{5}@bvrit\.ac\.in$/)) {
      res.status(400).json({ message: 'Email must be in format rollno@bvrit.ac.in (e.g., 22211a1251@bvrit.ac.in)' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid password' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Change Password: Send OTP
export const requestPasswordChange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as { email: string };

    if (!email.match(/^[0-9]{5}[a-zA-Z0-9]{5}@bvrit\.ac\.in$/)) {
      res.status(400).json({ message: 'Email must be in format rollno@bvrit.ac.in (e.g., 22211a1251@bvrit.ac.in)' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otp = generateOTP();
    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Laundry App Password Change OTP',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Verify OTP and Change Password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body as { email: string; otp: string; newPassword: string };

    if (otpStore[email] !== otp) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    delete otpStore[email];

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};