import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import OrderCard from '../components/OrderCard';
import OrderFilters from '../components/OrderFilters';

const PAGE_SIZE = 10;

const AllOrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role,user } = useAuth();
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState({});
  

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = localStorage.getItem('token');
         const params = new URLSearchParams({
          page,
          limit: PAGE_SIZE,
          ...filters,
        });
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/admin/orders?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        setOrders(res.data.orders || []);
        setTotalOrders(res.data.total || 0);
      } catch (err) {
        console.error('Failed to fetch all orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'user' && user.isAdmin === true) {
      setLoading(true);
      fetchAllOrders();
    }
  }, [role, page,user, filters]);

  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Orders (Admin)</h1>
      <OrderFilters  filters={filters} setFilters={setFilters} />
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

export default AllOrderAdmin;