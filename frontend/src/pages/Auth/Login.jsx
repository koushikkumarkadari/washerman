// src/pages/Auth/Login.jsx
import { useState} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal'; // Adjust the import based on your file structure

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      alert(data.message || 'Login successful!');
      navigate('/'); // Redirect to home or dashboard
      // Redirect or update UI as needed
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Gmail Address"
          className="input w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Don’t have an account?{' '}
  <Link to="/signup" className="text-blue-600 hover:underline">
    Sign up here
  </Link>
</p>
<p className="text-center text-sm mt-2">
  <span
    className="text-blue-600 hover:underline cursor-pointer"
    onClick={() => setShowForgot(true)}
  >
    Forgot Password?
  </span>
</p>
{showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
};

export default Login;
