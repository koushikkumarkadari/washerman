import React from 'react';

const OrderCard = ({ order, showStatusDropdown, onStatusChange }) => (
  <div className="bg-white shadow rounded p-4">
    <div className="flex justify-between mb-2">
      <span className="font-semibold">Order ID: {order._id}</span>
      <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
    </div>
    {showStatusDropdown ? (
      <div className="mb-2 flex items-center">
        <span className="font-medium mr-2">Status:</span>
        <select
          value={order.status}
          onChange={e => onStatusChange(order._id, e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    ) : (
      <div className="mb-2">
        <span className="font-medium">Status:</span> {order.status}
      </div>
    )}
    {order.paymentStatus && (
      <div className="mb-2">
        <span className="font-medium">Payment Status:</span> {order.paymentStatus}
      </div>
    )}
    {order.user && (
      <div className="mb-2">
        <span className="font-medium">User:</span> {order.user?.firstName || order.user}
      </div>
    )}
    {order.washerman && (
      <div className="mb-2">
        <span className="font-medium">Washerman:</span> {order.washerman?.firstName || order.washerman}
      </div>
    )}
    <ul className="mb-2">
      {order.items.map((item, idx) => (
        <li key={idx} className="flex justify-between">
          <span>
            {item.quantity} × {item.name} {item.ironing && '(Ironed)'}
          </span>
          <span>
            ₹{item.quantity * 10 + (item.ironing ? item.quantity * 5 : 0)}
          </span>
        </li>
      ))}
    </ul>
    <div className="font-bold flex justify-between">
      <span>Total</span>
      <span>₹{order.total}</span>
    </div>
  </div>
);

export default OrderCard;