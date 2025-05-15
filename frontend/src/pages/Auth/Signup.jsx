import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    console.log(formData.email+' sending OTP');
    if (!formData.email) {
      alert('Please enter your email to receive OTP');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { email: formData.email });
      alert(res.data.message || 'OTP sent to your email');
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email: formData.email, otp });
      if (res.data.verified) {
        alert('OTP Verified Successfully');
        setOtpVerified(true);
      } else {
        alert('Invalid OTP');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify your email with OTP before signing up');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const data = await signup(formData);
      alert(data.message || 'Signup successful!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        {/* Name Inputs */}
        <div className="flex space-x-2">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
            placeholder="First Name" className="input" required />
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange}
            placeholder="Middle Name" className="input" />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
            placeholder="Last Name" className="input" required />
        </div>

        {/* Email + OTP Buttons */}
        <div className="flex space-x-2">
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            placeholder="Gmail Address" className="input flex-1" required />
          <button type="button" onClick={sendOtp}
            className="bg-yellow-500 text-white px-3 rounded hover:bg-yellow-600">
            Send OTP
          </button>
        </div>

        {/* OTP Input (if sent) */}
        {otpSent && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="input flex-1"
            />
            <button type="button" onClick={verifyOtp}
              className="bg-green-600 text-white px-3 rounded hover:bg-green-700">
              Verify OTP
            </button>
          </div>
        )}

        {/* Phone, Role, Passwords */}
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
          placeholder="Phone Number" className="input" required pattern="[6-9]{1}[0-9]{9}" />
        <select name="role" value={formData.role} onChange={handleChange} className="input" required>
          <option value="user">User</option>
          <option value="washerman">Washerman</option>
        </select>
        <input type="password" name="password" value={formData.password} onChange={handleChange}
          placeholder="Password" className="input" required />
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
          placeholder="Confirm Password" className="input" required />

        <button type="submit" disabled={!otpVerified}
          className={`w-full py-2 rounded ${otpVerified ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-400 text-white cursor-not-allowed'}`}>
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
