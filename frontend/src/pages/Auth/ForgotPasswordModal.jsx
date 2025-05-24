import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/auth/forgot-password/send-otp`, { email });
      setStep(2);
      setMsg('OTP sent to your email.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/auth/forgot-password/verify-otp`, { email, otp });
      setStep(3);
      setMsg('OTP verified. Enter your new password.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg('Passwords do not match');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/auth/forgot-password/reset`, { email, password });
      setMsg('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        onClose();
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold m-4 text-center">Forgot Password</h2>
          <button className=" top-2 right-4 text-xl" onClick={onClose}>X</button>
        </div>
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="input w-full"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Verify OTP
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="input w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input w-full"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Reset Password
            </button>
          </form>
        )}
        {msg && <div className="mt-4 text-center text-red-600">{msg}</div>}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;