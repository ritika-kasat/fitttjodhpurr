import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react'
import { supabase, getUserRole } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import { useProviderStore } from '../../store/providerStore'

export default function ProviderLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { user, profile, loading: authLoading, setProfile } = useAuthStore()
  const { providerProfile } = useProviderStore()

  useEffect(() => {
    if (user && !authLoading && profile) {
      if (profile.role === 'member') {
        supabase.auth.signOut().then(() => {
          window.location.reload()
        })
      } else if (profile.role === 'provider') {
        navigate('/provider/dashboard')
      }
    }
  }, [user, profile, authLoading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    const role = await getUserRole();
    if (!role) {
      toast.error('Failed to retrieve user role.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    if (role !== 'provider') {
      toast.error('This account is registered as a user, not a fitness provider.', { duration: 5000 });
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user?.id)
      .single();
    if (profileError || !profile) {
      toast.error('Failed to retrieve provider profile.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    setProfile(profile);
    toast.success('Welcome Back, Coach!');
    navigate('/provider/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 grid grid-cols-1 lg:grid-cols-2 font-sans">
      {/* Form Column */}
      <div className="flex flex-col justify-between p-8 sm:p-16 lg:p-24 bg-white">
        {/* Top Header */}
        <Link to="/get-started" className="flex items-center gap-2 mb-12 self-start">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Fit<span className="text-primary">Provider</span>
          </span>
        </Link>

        {/* Center Content */}
        <div className="max-w-md w-full mx-auto my-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary mb-6">
            <ShieldAlert className="h-3.5 w-3.5" /> Provider Dashboard Portal
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-550 mb-8">Access your leads, schedules, pricing, and active classes.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  className="input-field pl-12 text-sm"
                  placeholder="coach@fitnesscentre.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary font-semibold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  className="input-field pl-12 text-sm"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-6"
              disabled={loading}
            >
              {loading ? 'Verifying Credentials...' : 'Sign In as Provider'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Not registered yet? <Link to="/provider/signup" className="text-primary font-bold hover:underline">Create a Provider account</Link>
          </p>
        </div>

        {/* Bottom Footer */}
        <p className="text-slate-400 text-xs mt-12">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>

      {/* Background Image / Promo Column */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200"
          className="w-full h-full object-cover"
          alt="Coach Training"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="absolute bottom-20 left-20 right-20 text-white">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-lg">
            <h2 className="text-4xl font-bold mb-4 uppercase leading-none text-white">
              Empower Jodhpur's Fitness Community
            </h2>
            <p className="text-lg text-white/95 leading-relaxed">
              List your gym, swimming pool, yoga center or personal studio. Manage inquiries, collect student feedback, and scale your operations effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
