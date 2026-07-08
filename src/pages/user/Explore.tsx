import React from 'react';
import { Link } from 'react-router-dom';

const Explore: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Explore Studios</h2>
      <p className="text-gray-300">Search and filter studios here.</p>
      <Link to="/user/dashboard" className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Explore;
