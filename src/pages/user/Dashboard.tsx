import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">User Dashboard</h2>
      <p className="text-gray-300">This is the user dashboard. Add actual content later.</p>
      <Link to="/user/explore" className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
        Explore Studios
      </Link>
    </div>
  );
};

export default UserDashboard;
