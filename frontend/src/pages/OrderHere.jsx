import React, { useEffect, useState } from 'react';
import WashermanCard from '../components/WashermanCard';
import axios from 'axios';

const OrderHere = () => {
  const [washermen, setWashermen] = useState([]);

  useEffect(() => {
    const fetchWashermen = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/washermen', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWashermen(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Failed to fetch washermen', err);
      }
    };

    fetchWashermen();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Choose a Washerman</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {washermen.map((washerman) => (
          <WashermanCard key={washerman._id} washerman={washerman} />
        ))}
      </div>
    </div>
  );
};

export default OrderHere;
