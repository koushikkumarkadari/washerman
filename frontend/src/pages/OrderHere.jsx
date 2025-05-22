import React, { useEffect, useState } from 'react';
import WashermanCard from '../components/WashermanCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderHere = () => {
  const [washermen, setWashermen] = useState([]);
  const { role,user } = useAuth();

  useEffect(() => {
    const fetchWashermen = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/user/washermen`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWashermen(res.data);
      } catch (err) {
        console.error('Failed to fetch washermen', err);
      }
    };

    fetchWashermen();
  }, []);

  // Toggle isApproved status for a washerman (admin only)
  const handleToggleApproval = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_URL}/api/admin/${id}/approve`,
        { isApproved: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWashermen((prev) =>
        prev.map((w) =>
          w._id === id ? { ...w, isApproved: !currentStatus } : w
        )
      );
    } catch (err) {
      alert('Failed to update approval status');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Choose a Washerman</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {washermen.map((washerman) => (
          <div key={washerman._id} className="relative">
            <WashermanCard washerman={washerman} />
            {role === 'user' && user.isAdmin===true && (
              <div className="mt-2 flex items-center">
                <label className="mr-2 font-medium">
                  Approved:
                </label>
                <input
                  type="checkbox"
                  checked={washerman.isApproved}
                  onChange={() =>
                    handleToggleApproval(washerman._id, washerman.isApproved)
                  }
                  className="w-5 h-5"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHere;
