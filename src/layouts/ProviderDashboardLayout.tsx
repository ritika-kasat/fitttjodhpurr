import React, { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useProviderStore } from '../store/providerStore'
import { 
  Dumbbell, Home, User, CreditCard, Clock, Inbox, 
  MessageSquare, Image, Settings, LogOut, Menu, X, 
  Bell, AlertCircle
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function ProviderDashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut, profile } = useAuthStore()
  const { providerProfile, getStats } = useProviderStore()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const stats = getStats()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const menuItems = [
    { label: 'Overview', path: '/provider/dashboard', icon: Home },
    { label: 'Studio Profile', path: '/provider/dashboard/profile', icon: User },
    { label: 'Pricing Plans', path: '/provider/dashboard/pricing', icon: CreditCard },
    { label: 'Class Timetable', path: '/provider/dashboard/schedule', icon: Clock },
    { label: 'Enquiries & Leads', path: '/provider/dashboard/leads', icon: Inbox, badge: stats.totalEnquiries > 0 ? stats.totalEnquiries : undefined },
    { label: 'Reviews & Feedback', path: '/provider/dashboard/reviews', icon: MessageSquare },
    { label: 'Media Gallery', path: '/provider/dashboard/media', icon: Image },
    { label: 'Settings', path: '/provider/dashboard/settings', icon: Settings },
  ]

  const hasProfile = providerProfile && providerProfile.businessName
  const providerName = providerProfile?.businessName || user?.user_metadata?.full_name || profile?.full_name || user?.email?.split('@')[0] || 'Provider'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200">
        <div className="p-8">
          <Link to="/provider/dashboard" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Fit<span className="text-primary">Provider</span>
            </span>
          </Link>
        </div>

        {/* Quick Profile Summary */}
        {hasProfile ? (
          <div className="mx-4 mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <img 
              src={providerProfile.profilePhoto || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=150'} 
              className="w-11 h-11 rounded-xl object-cover border-2 border-primary/20"
              alt="Studio Logo"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">{providerName}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-500 font-medium capitalize">{providerProfile.category} Partner</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> Please complete onboarding.
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-grow px-4 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all",
                  active 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 font-medium hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <h1 className="text-xl font-bold text-slate-900 hidden lg:block">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{providerName}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Provider</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                {providerProfile?.profilePhoto ? (
                  <img src={providerProfile.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  providerName.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-white flex flex-col p-6 pt-20">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const active = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-xl font-medium transition-all",
                      active 
                        ? "bg-primary text-white" 
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="mt-auto flex items-center justify-center gap-3 p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold w-full transition-all"
            >
              <LogOut className="h-5 w-5" /> Sign Out
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
