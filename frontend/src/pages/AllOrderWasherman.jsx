import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AllOrderWasherman = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWashermanOrders = async () => {
      try {
        console.log('Fetching washerman orders...');
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/washermen/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch washerman orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchWashermanOrders();
    }
  }, [user]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders Assigned to You</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow rounded p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Order ID: {order._id}</span>
                <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Status:</span> {order.status}
              </div>
              <div className="mb-2">
                <span className="font-medium">User:</span> {order.user?.firstName || order.user}
              </div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrderWasherman;