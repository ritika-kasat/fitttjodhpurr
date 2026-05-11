import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, User, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Dumbbell className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  Fit<span className="text-primary">Jodhpur</span>
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-primary font-medium">Home</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-primary font-medium">Pricing</Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-slate-600 hover:text-primary font-medium">Login</Link>
                  <Link to="/signup" className="btn-primary">Get Started</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-4">
            <Link to="/" className="block text-slate-600 font-medium">Home</Link>
            <Link to="/pricing" className="block text-slate-600 font-medium">Pricing</Link>
            {user ? (
              <>
                <Link to={profile?.role === 'admin' ? '/admin' : '/dashboard'} className="block text-slate-600 font-medium">Dashboard</Link>
                <button onClick={handleSignOut} className="block text-red-500 font-medium">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-slate-600 font-medium">Login</Link>
                <Link to="/signup" className="block btn-primary text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Dumbbell className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-white tracking-tight">
                  Fit<span className="text-primary">Jodhpur</span>
                </span>
              </Link>
              <p className="max-w-md">
                The ultimate fitness discovery and membership platform for Jodhpur. 
                Access the best gyms, yoga studios, and fitness centers with a single membership.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Join FitPass</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>info@fitjodhpur.in</li>
                <li>+91 98765 43210</li>
                <li>Ratanada, Jodhpur, RJ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} FitJodhpur. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
