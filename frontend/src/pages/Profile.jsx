import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div className="p-8">No user data found.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow rounded p-6 space-y-4">
        <div>
          <span className="font-medium">Name: </span>
          {user.firstName} {user.middleName} {user.lastName}
        </div>
        <div>
          <span className="font-medium">Email: </span>
          {user.email}
        </div>
        <div>
          <span className="font-medium">Role: </span>
          {role}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
        <Link
          to="/contact"
          className="block mt-4 text-center text-blue-600 hover:underline"
        >
          📞 Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Profile;