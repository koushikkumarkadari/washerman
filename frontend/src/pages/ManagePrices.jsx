import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CLOTH_ITEMS = [
  'Shirts', 'Pants', 'Nightpants', 'T-Shirts', 'Hoodies', 'Neckars',
  '3/4 Shorts', 'Blanket', 'Bedsheet', 'Towel', 'Underwears', 'Banians', 'Socks'
];

const ManagePrices = () => {
  const { user } = useAuth();
  const [id] = useState(user.id);
  const [pricing, setPricing] = useState({});

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/washermen/${id}/pricing`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPricing(res.data.pricing || {});
      } catch (err) {
        alert('Failed to fetch pricing');
      }
    };
    fetchPricing();
  }, [id]);

  const handleChange = (item, field, value) => {
    setPricing(prev => ({
      ...prev,
      [item]: {
        ...prev[item],
        [field]: Number(value)
      }
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_URL}/api/washermen/${id}/pricing`,
        { pricing },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Prices updated successfully!');
    } catch (err) {
      alert('Error saving prices');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Cloth Prices</h1>
      <div className="space-y-4">
        {CLOTH_ITEMS.map((item) => (
          <div key={item} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 border p-4 rounded shadow">
            <span className="font-medium text-gray-700">{item}</span>
            <input
              type="number"
              value={pricing[item]?.washing ?? 10}
              onChange={(e) => handleChange(item, 'washing', e.target.value)}
              className="p-2 border rounded"
              placeholder="Washing Price"
            />
            <input
              type="number"
              value={pricing[item]?.ironing ?? 5}
              onChange={(e) => handleChange(item, 'ironing', e.target.value)}
              className="p-2 border rounded"
              placeholder="Ironing Price"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
      >
        Save Prices
      </button>
    </div>
  );
};

export default ManagePrices;
