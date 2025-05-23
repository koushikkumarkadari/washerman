import React, { useEffect, useState } from 'react';
import WashermanCard from '../components/WashermanCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderHere;
