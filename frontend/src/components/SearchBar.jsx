import React, { useState } from 'react';

const SearchBar = ({ onSearch, initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(email.trim());
  };

  const handleReset = () => {
    setEmail('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col md:flex-row items-center gap-2">
      <div>
      <input
        type="email"
        placeholder="Search by user email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded p-2 w-64"
      />
      </div>
      <div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>
      <button
        type="button"
        className="bg-gray-200 px-3 py-2 rounded ml-2"
        onClick={handleReset}
      >
        Reset
      </button>
      </div>
    </form>
  );
};

export default SearchBar;