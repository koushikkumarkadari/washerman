import React from 'react';

const Navbar = ({ role, user }) => {
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
      { name: 'Profile', href: '/profile' },
    ],
    admin: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Washerman Management', href: '/order' },
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

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🧼 Washerman</h1>
      <ul className="flex space-x-6">
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
      </ul>
    </nav>
  );
};

export default Navbar;
