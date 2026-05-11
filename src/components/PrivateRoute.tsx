import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface PrivateRouteProps {
  role?: 'member' | 'admin'
}

const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { user, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Checking session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default PrivateRoute
