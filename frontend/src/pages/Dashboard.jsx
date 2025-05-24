import React from 'react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full flex flex-col items-center">
        <img
          src="https://i.ibb.co/q3NVw15R/logo.webp"
          alt="Washerman Logo"
          className="w-24 h-24 mb-4"
        />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 text-center">
          Welcome to Washerman Service
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Fast, reliable, and affordable laundry & ironing service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <a
            href="/order"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition"
          >
            Place an Order
          </a>
          <a
            href="/my-orders"
            className="bg-white border border-blue-600 text-blue-700 font-semibold py-3 px-8 rounded-lg shadow hover:bg-blue-50 transition"
          >
            My Orders
          </a>
        </div>
        <div className="mt-8 text-gray-500 text-center text-sm">
          <span>Need help? </span>
          <a href="/profile" className="text-blue-600 hover:underline">
            Visit your profile
          </a>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Washerman Service. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;