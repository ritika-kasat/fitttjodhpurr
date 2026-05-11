import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

// Components
import PrivateRoute from './components/PrivateRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CenterDetail from './pages/CenterDetail'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import MemberPass from './pages/MemberPass'
import DashboardOverview from './pages/member/DashboardOverview'
import CheckIn from './pages/member/CheckIn'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error) {
      setProfile(data)
    }
    setLoading(false)
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/center/:id" element={<CenterDetail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pass" element={<MemberPass />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Member Protected Routes */}
        <Route element={<PrivateRoute role="member" />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/dashboard/checkin" element={<CheckIn />} />
          {/* Add more member routes as needed */}
          <Route path="/dashboard/subscription" element={<div className="p-8">My Subscription (Coming Soon)</div>} />
          <Route path="/dashboard/schedule" element={<div className="p-8">Class Schedule (Coming Soon)</div>} />
          <Route path="/dashboard/payments" element={<div className="p-8">Payments (Coming Soon)</div>} />
          <Route path="/dashboard/profile" element={<div className="p-8">Profile (Coming Soon)</div>} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Add more admin routes as needed */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
