import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Mail, Lock, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase, getUserRole } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, profile, loading: authLoading, setProfile } = useAuthStore()

  useEffect(() => {
    if (user && !authLoading && profile) {
      if (profile.role === 'provider') {
        supabase.auth.signOut().then(() => {
          window.location.reload()
        })
      } else if (profile.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, profile, authLoading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    const role = await getUserRole()
    if (!role) {
      toast.error('Failed to retrieve user role.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (role === 'provider') {
      toast.error('This account is registered as a fitness provider, not a user.', { duration: 5000 })
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user?.id)
      .single()

    if (profileError || !profileData) {
      toast.error('Failed to retrieve user profile.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    setProfile(profileData)
    toast.success('Welcome back!')
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Form Section */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Fit<span className="text-primary">Jodhpur</span>
            </span>
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-10">Continue your fitness journey in the Blue City.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email"
                  className="input-field pl-12"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary font-bold hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password"
                  className="input-field pl-12"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
          
          <p className="text-center text-slate-500 mt-10">
            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
      
      {/* Image Section */}
      <div className="hidden lg:block relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover"
          alt="Gym"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="absolute bottom-20 left-20 right-20 text-white">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <h2 className="text-4xl font-bold mb-4">"The only bad workout is the one that didn't happen."</h2>
            <p className="text-xl text-white/80">— Jodhpur's Fitness Community</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
