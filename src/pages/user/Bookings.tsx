import React from 'react';
import { Link } from 'react-router-dom';

const Bookings: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">My Bookings</h2>
      <p className="text-gray-300">Your upcoming and past class bookings will be listed here.</p>
      <Link to="/user/dashboard" className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Bookings;
