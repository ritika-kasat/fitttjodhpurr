import React from 'react';
import { Link } from 'react-router-dom';

const StudioDetail: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Studio Detail</h2>
      <p className="text-gray-300">Details about the studio will appear here.</p>
      <Link to="/user/explore" className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
        Back to Explore
      </Link>
    </div>
  );
};

export default StudioDetail;
