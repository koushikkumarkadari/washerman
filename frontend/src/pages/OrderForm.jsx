import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CLOTH_ITEMS = [
  'Shirts', 'Pants', 'Nightpants', 'T-Shirts', 'Hoodies', 'Neckars',
  '3/4 Shorts', 'Blanket', 'Bedsheet', 'Towel', 'Underwears', 'Banians', 'Socks'
];

const OrderForm = () => {
  const { id } = useParams(); // washerman ID
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ironing, setIroning] = useState(false);

  const handleAddItem = () => {
    if (!selectedItem || quantity <= 0) return;
    const existingIndex = items.findIndex((item) => item.name === selectedItem);
    const newItem = {
      name: selectedItem,
      quantity: parseInt(quantity),
      ironing: ironing,
    };
    const updatedItems = [...items];
    if (existingIndex >= 0) {
      updatedItems[existingIndex] = newItem;
    } else {
      updatedItems.push(newItem);
    }
    setItems(updatedItems);
    setSelectedItem('');
    setQuantity('');
    setIroning(false);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const base = item.quantity * 10;
      const iron = item.ironing ? item.quantity * 5 : 0;
      return total + base + iron;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item to your order.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/washermen/${id}/order`,
        { items, total: calculateTotal() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Order placed successfully!');
      navigate('/my-orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Place Order for Washerman</h1>
      <p className="text-gray-600 mb-6">Washerman ID: <span className="font-medium">{id}</span></p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Item</option>
            {CLOTH_ITEMS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="border p-2 rounded"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={ironing}
              onChange={() => setIroning(!ironing)}
            />
            <span>Add Ironing (+₹5/item)</span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
        >
          Add to Order
        </button>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">No items added yet.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between text-gray-700">
                  <span>
                    {item.quantity} × {item.name} {item.ironing && '(Ironed)'}
                  </span>
                  <span>
                    ₹{item.quantity * 10 + (item.ironing ? item.quantity * 5 : 0)}
                  </span>
                </li>
              ))}
              <hr />
              <li className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </li>
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
