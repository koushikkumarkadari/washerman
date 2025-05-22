import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ role, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = {
    user: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Order Here', href: '/order' },
      { name: 'My Orders', href: '/my-orders' },
      { name: 'Profile', href: '/profile' },
    ],
    washerman: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'My Orders', href: '/washing-orders' },
      { name: 'manage prices', href: '/manage-prices' },
      { name: 'Profile', href: '/profile' },
    ],
    admin: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Washerman Management', href: '/washerman-management' },
      { name: 'User Management', href: '/user-management' },
      { name: 'All Orders', href: '/all-orders' },
    ],
  };

  // Logic: If role is "user" and user.isAdmin is true, show admin links
  let navLinks;
  if (role === 'user' && user?.isAdmin) {
    navLinks = links.admin;
  } else {
    navLinks = links[role] || [];
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🧼 Washerman</h1>
      <ul className="flex space-x-6 items-center">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              {link.name}
            </a>
          </li>
        ))}
        {(role=="user" && user?.isAdmin)&&<li>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </li>}
      </ul>
    </nav>
  );
};

export default Navbar;
