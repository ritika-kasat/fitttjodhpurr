import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Mail, Lock, User, Phone, Calendar, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    preferredType: 'gym'
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          date_of_birth: formData.dob,
          preferred_type: formData.preferredType,
          role: 'member'
        }
      }
    })

    if (error) {
      toast.error(error.message)
    } else if (data?.session) {
      // User is auto-confirmed, go straight to dashboard
      toast.success('Account created! Welcome to FitJodhpur! 🎉')
      navigate('/dashboard')
    } else {
      // Email confirmation required
      toast.success('Account created! Check your email to confirm, then log in.', { duration: 6000 })
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Form Section */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Fit<span className="text-primary">Jodhpur</span>
            </span>
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join the Movement</h1>
          <p className="text-slate-500 mb-10">Start your fitness journey across Jodhpur today.</p>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text"
                  className="input-field pl-12"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="tel"
                    className="input-field pl-12"
                    placeholder="9876543210"
                    pattern="[6-9][0-9]{9}"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="date"
                    className="input-field pl-12"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email"
                  className="input-field pl-12"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password"
                  className="input-field pl-12"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Fitness Type</label>
              <select 
                className="input-field appearance-none"
                value={formData.preferredType}
                onChange={(e) => setFormData({...formData, preferredType: e.target.value})}
              >
                {['Gym', 'Yoga', 'CrossFit', 'MMA', 'Zumba', 'Pilates', 'Swimming'].map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 mt-4"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
          
          <p className="text-center text-slate-500 mt-10">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
      
      {/* Image Section */}
      <div className="hidden lg:block relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover"
          alt="Fitness"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="absolute top-20 left-20 right-20 text-white">
          <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <h2 className="text-4xl font-bold mb-4">"Fitness is not about being better than someone else. It's about being better than you were yesterday."</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
