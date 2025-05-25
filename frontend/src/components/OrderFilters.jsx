import React, { useState } from 'react';

const OrderFilters = ({ filters, setFilters }) => {
  const [customRange, setCustomRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false); // toggle state

  const handleDateRange = (range) => {
    let from = '', to = '';
    const today = new Date();
    if (range === 'today') {
      from = to = today.toISOString().slice(0, 10);
    } else if (range === 'last7') {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 6);
      from = last7.toISOString().slice(0, 10);
      to = today.toISOString().slice(0, 10);
    } else if (range === 'month') {
      from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      to = today.toISOString().slice(0, 10);
    }
    setFilters((prev) => ({
      ...prev,
      dateFrom: from,
      dateTo: to,
      dateRange: range,
    }));
    setCustomRange({ from: '', to: '' });
  };

  const handleCustomRange = () => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: customRange.from,
      dateTo: customRange.to,
      dateRange: 'custom',
    }));
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <div
        className="flex items-center gap-2 cursor-pointer w-fit"
        onClick={() => setShowFilters(prev => !prev)}
      >
        <span
          className={`transition-transform duration-300 text-lg ${
            showFilters ? 'rotate-180 text-blue-600' : 'rotate-0 text-gray-500'
          }`}
        >
          ▼
        </span>
        <span className="font-medium text-sm">Filters</span>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="mt-4 bg-white shadow rounded p-4 flex flex-wrap gap-4 items-end">
          {/* Date Range */}
          <div>
            <label className="block font-medium mb-1">Date Range</label>
            <select
              value={filters.dateRange || ''}
              onChange={e => handleDateRange(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">All</option>
              <option value="today">Today</option>
              <option value="last7">Last 7 days</option>
              <option value="month">This month</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {filters.dateRange === 'custom' && (
            <div className="flex gap-2 items-end">
              <div>
                <label className="block text-xs">From</label>
                <input
                  type="date"
                  value={customRange.from}
                  onChange={e => setCustomRange((prev) => ({ ...prev, from: e.target.value }))}
                  className="border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-xs">To</label>
                <input
                  type="date"
                  value={customRange.to}
                  onChange={e => setCustomRange((prev) => ({ ...prev, to: e.target.value }))}
                  className="border rounded p-2"
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleCustomRange}
              >
                Apply
              </button>
            </div>
          )}

          {/* Email Filter */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Search by email"
              value={filters.email || ''}
              onChange={e => setFilters((prev) => ({ ...prev, email: e.target.value }))}
              className="border rounded p-2"
            />
          </div>

          {/* Order Total Filter */}
          <div>
            <label className="block font-medium mb-1">Order Total</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.totalMin || ''}
              onChange={e => setFilters((prev) => ({ ...prev, totalMin: e.target.value }))}
              className="border rounded p-2 w-20"
            />
            <span className="mx-1">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.totalMax || ''}
              onChange={e => setFilters((prev) => ({ ...prev, totalMax: e.target.value }))}
              className="border rounded p-2 w-20"
            />
          </div>

          {/* Sort Options */}
          <div>
            <label className="block font-medium mb-1">Sort By</label>
            <select
              value={filters.sort || ''}
              onChange={e => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
              className="border rounded p-2"
            >
              <option value="">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="totalLowHigh">Total Price (Low to High)</option>
              <option value="totalHighLow">Total Price (High to Low)</option>
            </select>
          </div>

          {/* Reset */}
          <button
            type="button"
            className="ml-auto bg-gray-200 px-3 py-1 rounded"
            onClick={() => setFilters({})}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
