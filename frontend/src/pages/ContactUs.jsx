import React, { useState } from 'react';

const ContactUs = () => {
  // Fetch user info from localStorage (assuming user is stored as JSON string)
  let name = '';
  let email = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    name = user?.firstName
      ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')
      : '';
    email = user?.email || '';
  } catch {
    // fallback to empty
  }

  const [form, setForm] = useState({ message: '', captcha: '' });
  const [submitted, setSubmitted] = useState(false);

  // Simple CAPTCHA: What is 3 + 4?
  const CAPTCHA_ANSWER = '7';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.captcha !== CAPTCHA_ANSWER) {
      alert('CAPTCHA incorrect!');
      return;
    }
    if (!form.message) {
      alert('Please enter your message.');
      return;
    }
    // Send feedback to backend
    try {
      await fetch(`${import.meta.env.VITE_URL}/api/user/washermen/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: form.message }),
      });
      setSubmitted(true);
    } catch {
      alert('Failed to send feedback.');
    }
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
        <div className="bg-white shadow rounded p-6 text-center">
          <p className="text-green-600 font-semibold">Thank you for contacting us! We will get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <div className="bg-white shadow rounded p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-medium">Name:</label>
            <input
              type="text"
              value={name}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="font-medium">Email:</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full border p-2 rounded"
            rows={4}
            value={form.message}
            onChange={handleChange}
            required
          />
          <div>
            <label className="font-medium">What is 3 + 4? (CAPTCHA)</label>
            <input
              type="text"
              name="captcha"
              className="w-full border p-2 rounded mt-1"
              value={form.captcha}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
        <div className="mt-6 space-y-2">
          <div>
            <span className="font-medium">Email:</span> washerman.service@email.com
          </div>
          <div>
            <span className="font-medium">Phone:</span> +91 98765 43210
          </div>
          <div>
            <span className="font-medium">Address:</span> 123 Laundry Lane, Hyderabad, Telangana, India
          </div>
          <div className="mt-4">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.406168893019!2d78.4866713148777!3d17.38504408807045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb977b2c8b1e7d%3A0x7d1b1b1b1b1b1b1b!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="flex space-x-4 mt-4 justify-center">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" className="h-6 w-6" />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" className="h-6 w-6" />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;