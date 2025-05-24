import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import OrderCard from '../components/OrderCard';

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
              <OrderCard key={order._id} order={order} />
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