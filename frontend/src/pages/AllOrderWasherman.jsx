import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import OrderCard from '../components/OrderCard';
import OrderFilters from '../components/OrderFilters';
import SearchBar from '../components/SearchBar';

const PAGE_SIZE = 10;

const AllOrderWasherman = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    const fetchWashermanOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
          page,
          limit: PAGE_SIZE,
          ...filters,
        });
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/washermen/my-orders?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(res.data.orders || []);
        setTotalOrders(res.data.total || 0);
      } catch (err) {
        console.error('Failed to fetch washerman orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      setLoading(true);
      fetchWashermanOrders();
    }
  }, [user, page, filters]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_URL}/api/washermen/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleSearch = (email) => {
    setFilters((prev) => ({ ...prev, email }));
    setPage(1);
  };

  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders Assigned to You</h1>
      <SearchBar onSearch={handleSearch} initialEmail={filters.email || ''} />
      <OrderFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                showStatusDropdown={true}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
};

export default AllOrderWasherman;