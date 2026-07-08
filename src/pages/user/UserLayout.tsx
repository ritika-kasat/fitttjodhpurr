import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut } from 'lucide-react';

const UserLayout: React.FC = () => {
  const { profile, signOut } = useAuthStore();

  const navItems = [
    { name: 'Explore', path: '/user/explore' },
    { name: 'My Memberships', path: '/user/memberships' },
    { name: 'My Bookings', path: '/user/bookings' },
    { name: 'Profile', path: '/user/profile' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between bg-gray-800 px-6 py-4 shadow-md">
        <Link to="/user/dashboard" className="text-2xl font-bold text-orange-500">
          FitJodhpur
        </Link>
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
      {/* Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
