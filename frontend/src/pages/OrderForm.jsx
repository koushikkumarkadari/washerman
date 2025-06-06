import React, { useState, useEffect } from 'react';
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
  const [pricing, setPricing] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [loadingOffline, setLoadingOffline] = useState(false);


  // Fetch pricing for this washerman
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

  // Use washerman's pricing if available, else fallback to default
  const getItemPrice = (item, ironing) => {
    const washPrice = pricing[item]?.washing ?? 10;
    const ironPrice = pricing[item]?.ironing ?? 5;
    return ironing ? washPrice + ironPrice : washPrice;
  };

  const handleAddItem = () => {
    if (!selectedItem || quantity <= 0) return;
    const price = getItemPrice(selectedItem, ironing);
    const existingIndex = items.findIndex((item) => item.name === selectedItem && item.ironing === ironing);
    const newItem = {
      name: selectedItem,
      quantity: parseInt(quantity),
      ironing: ironing,
      price: price // Add price per item
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
      return total + item.quantity * item.price;
    }, 0);
  };

  // Modal open on confirm order
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item to your order.');
      return;
    }
    setShowPaymentModal(true);
  };

  // Online payment flow
  const handleSubmitOnline = async () => {
    setLoadingOnline(true);
    try {
      const token = localStorage.getItem('token');
      // 1. Place order first
      const orderRes = await axios.post(
        `${import.meta.env.VITE_URL}/api/user/washermen/${id}/order`,
        { items, total: calculateTotal() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderId = orderRes.data.order._id;

      // 2. Create Razorpay order
      const paymentRes = await axios.post(
        `${import.meta.env.VITE_URL}/api/payments/create-order`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { razorpayOrderId, amount, key } = paymentRes.data;

      // 3. Open Razorpay checkout
      const options = {
        key,
        amount: amount * 100,
        currency: 'INR',
        name: 'Washerman Service',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          // 4. Verify payment
          await axios.post(
            `${import.meta.env.VITE_URL}/api/payments/verify`,
            {
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert('Payment successful!');
          navigate('/my-orders');
        },
        prefill: {
          email: '', // Optionally fill user email
        },
        theme: {
          color: '#3399cc',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order or payment');
    } finally {
      setLoadingOnline(false);
      setShowPaymentModal(false);
    }
  };

  // COD flow
  const handleSubmitCod = async () => {
    setLoadingOffline(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_URL}/api/user/washermen/${id}/order`,
        { items, total: calculateTotal(), paymentStatus: 'unpaid' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Order placed successfully! Please pay on delivery.');
      navigate('/my-orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoadingOffline(false);
      setShowPaymentModal(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-blue-300'>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Place Order for Washerman</h1>
        <p className="text-gray-600 mb-6">Washerman ID: <span className="font-medium">{id}</span></p>

        <form onSubmit={handleConfirmOrder}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Item</option>
              {CLOTH_ITEMS.map((item) => (
                <option key={item} value={item}>
                  {item} (₹{pricing[item]?.washing ?? 10}{' '}
                  {pricing[item]?.ironing !== undefined ? `/ Iron: ₹${pricing[item]?.ironing}` : ''}
                  )
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              max={30}
              value={quantity}
              onChange={e => {
                // Prevent entering more than 30
                const val = Math.max(1, Math.min(30, Number(e.target.value)));
                setQuantity(val);
              }}
              placeholder="Quantity"
              className="border p-2 rounded"
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={ironing}
                onChange={() => setIroning(!ironing)}
              />
              <span>Add Ironing (+₹{pricing[selectedItem]?.ironing ?? 5}/item)</span>
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
                  <li key={index} className="flex justify-between items-center text-gray-700">
                    <span>
                      {item.quantity} × {item.name} {item.ironing && '(Ironed)'}
                    </span>
                    <span className="flex items-center gap-2">
                      ₹{item.quantity * getItemPrice(item.name, item.ironing)}
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:underline text-sm"
                        onClick={() => {
                          setItems(items.filter((_, i) => i !== index));
                        }}
                      >
                        Remove
                      </button>
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-xs flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-3"
              onClick={handleSubmitOnline}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Online Payment'}
            </button>
            <button
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              onClick={handleSubmitCod}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Cash on Delivery'}
            </button>
            <button
              className="mt-4 text-blue-600 hover:underline"
              onClick={() => setShowPaymentModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
