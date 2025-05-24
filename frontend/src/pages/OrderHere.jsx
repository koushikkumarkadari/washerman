import React, { useEffect, useState } from 'react';
import WashermanCard from '../components/WashermanCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

const OrderHere = () => {
  const [washermen, setWashermen] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchWashermen = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/user/washermen?page=${page}&limit=${PAGE_SIZE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWashermen(res.data.washermen|| []);
        setTotal(res.data.total|| 0);
        console.log(res.data);
      } catch (err) {
        console.error('Failed to fetch washermen', err);
      }
    };

    fetchWashermen();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Choose a Washerman</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {washermen.map((washerman) => (
          <div key={washerman._id} className="relative">
            <WashermanCard washerman={washerman} />
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default OrderHere;
