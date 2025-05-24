import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/orders/my?page=${page}&limit=${PAGE_SIZE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(res.data.orders || []);
        setTotalOrders(res.data.total || 0);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchOrders();
  }, [page]);

  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <>
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
                  <span className="font-medium">Payment Status:</span> {order.paymentStatus}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Washerman:</span> {order.washerman?.firstName || order.washerman}
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
          {/* Pagination Controls */}
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
};

export default MyOrder;