import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

// Components
import PrivateRoute from './components/PrivateRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Pages
import Home from './pages/Home'
import Profile from './pages/user/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CenterDetail from './pages/CenterDetail'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import MemberPass from './pages/MemberPass'
import GetStarted from './pages/member/GetStarted'
import DashboardOverview from './pages/member/DashboardOverview'
import CheckIn from './pages/member/CheckIn'
import Payments from './pages/member/Payments'
import AdminDashboard from './pages/admin/AdminDashboard'

// Provider Pages & Layouts
import RoleSelection from './pages/RoleSelection'
import ProviderLogin from './pages/provider/ProviderLogin'
import ProviderSignup from './pages/provider/ProviderSignup'
import ProviderOnboarding from './pages/provider/ProviderOnboarding'
import ProviderDashboardLayout from './layouts/ProviderDashboardLayout'
import ProviderHome from './pages/provider/dashboard/ProviderHome'
import ProviderProfile from './pages/provider/dashboard/ProviderProfile'
import ProviderPricing from './pages/provider/dashboard/ProviderPricing'
import ProviderLeads from './pages/provider/dashboard/ProviderLeads'
import ProviderReviews from './pages/provider/dashboard/ProviderReviews'
import ProviderSchedule from './pages/provider/dashboard/ProviderSchedule'
import ProviderMedia from './pages/provider/dashboard/ProviderMedia'
import ProviderSettings from './pages/provider/dashboard/ProviderSettings'

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
      <ErrorBoundary>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/explore" element={<Home />} />
          <Route path="/center/:id" element={<CenterDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pass" element={<MemberPass />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Role Separation Entrance & Separate Provider Flows */}
          <Route path="/get-started" element={<Navigate to="/" replace />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/provider/signup" element={<ProviderSignup />} />

          {/* Member Protected Routes */}
          <Route element={<PrivateRoute role="member" />}> 
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/checkin" element={<CheckIn />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/payments" element={<Payments />} />
            <Route path="/dashboard/get-started" element={<GetStarted />} />
            <Route path="/dashboard/subscription" element={<Navigate to="/pricing" replace />} />
            <Route path="/dashboard/schedule" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Provider Protected Routes */}
          <Route element={<PrivateRoute role="provider" />}> 
            <Route path="/provider/onboarding" element={<ProviderOnboarding />} />
            <Route element={<ProviderDashboardLayout />}> 
              <Route path="/provider/dashboard" element={<ProviderHome />} />
              <Route path="/provider/dashboard/profile" element={<ProviderProfile />} />
              <Route path="/provider/dashboard/pricing" element={<ProviderPricing />} />
              <Route path="/provider/dashboard/leads" element={<ProviderLeads />} />
              <Route path="/provider/dashboard/reviews" element={<ProviderReviews />} />
              <Route path="/provider/dashboard/schedule" element={<ProviderSchedule />} />
              <Route path="/provider/dashboard/media" element={<ProviderMedia />} />
              <Route path="/provider/dashboard/settings" element={<ProviderSettings />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute role="admin" />}> 
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Add more admin routes as needed */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  )
}

export default App
