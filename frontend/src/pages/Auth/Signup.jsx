// src/pages/Auth/Signup.jsx
import { useState } from 'react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: OTP verification & API call
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <div className="flex space-x-2">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
            placeholder="First Name" className="input" required />
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange}
            placeholder="Middle Name" className="input" />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
            placeholder="Last Name" className="input" required />
        </div>

        <input type="email" name="email" value={formData.email} onChange={handleChange}
          placeholder="Gmail Address" className="input" required />

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

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
