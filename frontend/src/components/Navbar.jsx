import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ role, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <nav className="bg-white shadow-md p-4 flex justify-between items-center relative w-full">
      <div className="flex items-center" onClick={() => navigate('/')}>
        <img
          src="https://i.ibb.co/prQKksYh/assets-task-01jw0trjw3e8cbz9w61v81yb5e-1748079800-img-1.jpg"
          alt="Washerman Logo"
          className="h-10 w-10 mr-2 inline-block"
        />
        <h1 className="text-xl font-bold text-blue-600">Washerman</h1>
      </div>
      {/* Hamburger icon for mobile */}
      <button
        className="md:hidden text-3xl focus:outline-none"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      {/* Desktop nav */}
      <ul className="hidden md:flex space-x-6 items-center">
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
        {(role === "user" && user?.isAdmin) && (
          <li>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
      {/* Mobile nav */}
      {mobileOpen && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 z-50 md:hidden">
          {navLinks.map((link) => (
            <li key={link.name} className="mb-2 w-full text-center">
              <a
                href={link.href}
                className="block text-gray-700 hover:text-blue-500 font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
          {(role === "user" && user?.isAdmin) && (
            <li className="w-full text-center">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-3/4"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
