import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  Calendar, 
  QrCode, 
  History, 
  UserCircle, 
  LogOut,
  Bell,
  Dumbbell
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { profile, signOut } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Subscription', icon: CreditCard, path: '/dashboard/subscription' },
    { name: 'Class Schedule', icon: Calendar, path: '/dashboard/schedule' },
    { name: 'Check-In', icon: QrCode, path: '/dashboard/checkin' },
    { name: 'Payments', icon: History, path: '/dashboard/payments' },
    { name: 'Profile', icon: UserCircle, path: '/dashboard/profile' },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Fit<span className="text-primary">Jodhpur</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 font-medium hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-900">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{profile?.full_name}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{profile?.role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  profile?.full_name?.charAt(0) || 'U'
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
