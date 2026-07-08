import React from 'react';
import { useAuthStore } from '../../store/authStore';
import DashboardLayout from '../../layouts/DashboardLayout';

const Profile: React.FC = () => {
  const { user, profile } = useAuthStore();
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-900">User Profile</h2>
        <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl space-y-4 text-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</span>
            <p className="text-base font-bold text-slate-900">
              {user?.user_metadata?.full_name || profile?.full_name || user?.email?.split('@')[0] || 'N/A'}
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</span>
            <p className="text-base font-bold text-slate-900">{profile?.email || user?.email || 'N/A'}</p>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Mobile Number</span>
            <p className="text-base font-bold text-slate-900">{profile?.phone || 'N/A'}</p>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Preferred Location Area</span>
            <p className="text-base font-bold text-slate-900">{profile?.area || 'Jodhpur'}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
