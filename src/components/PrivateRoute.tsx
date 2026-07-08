import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface PrivateRouteProps {
  role?: 'member' | 'admin' | 'provider'
}

const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { user, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Checking session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // If we're trying to access a provider route, redirect to provider/login, else standard login
    return <Navigate to={role === 'provider' ? '/provider/login' : '/login'} />
  }

  if (role && profile?.role !== role) {
    // If not matching role, redirect to their respective dashboard or landing
    if (profile?.role === 'provider') {
      return <Navigate to="/provider/dashboard" />
    } else if (profile?.role === 'admin') {
      return <Navigate to="/admin" />
    } else {
      return <Navigate to="/dashboard" />
    }
  }

  return <Outlet />
}

export default PrivateRoute
