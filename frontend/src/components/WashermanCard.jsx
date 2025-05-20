import React from 'react';
import { useNavigate } from 'react-router-dom';

const WashermanCard = ({ washerman }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/order/${washerman._id}`); // dynamic route to ordering form
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer shadow-lg rounded-xl p-4 hover:bg-gray-100 transition"
    >
      <img
        src={washerman.image || 'https://via.placeholder.com/150'}
        alt={washerman.firstName}
        className="w-full h-40 object-cover rounded-md mb-2"
      />
      <h2 className="text-lg font-semibold">{washerman.firstName}</h2>
    </div>
  );
};

export default WashermanCard;
