import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Dumbbell,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'

interface ProviderFormData {
  fullName: string
  email: string
  password: string
  phone: string
  dob: string
  fitnessCategory: string
}

export default function ProviderSignup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<ProviderFormData>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    fitnessCategory: 'gym',
  })

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            date_of_birth: formData.dob,
            preferred_type: formData.fitnessCategory,
            role: 'provider',
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data?.session) {
        toast.success('Account created successfully 🎉')
        navigate('/provider/onboarding')
      } else {
        toast.success(
          'Account created! Please verify your email before login.',
          { duration: 5500 }
        )
        navigate('/provider/login')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 grid grid-cols-1 lg:grid-cols-2 font-sans">
      {/* Left Side */}
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-20 bg-white">
        {/* Logo */}
        <Link
          to="/get-started"
          className="flex items-center gap-2 mb-10 self-start"
        >
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-slate-900">
            Fit<span className="text-primary">Provider</span>
          </h1>
        </Link>

        {/* Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            Join Fitness Network
          </div>

          <h2 className="text-4xl font-extrabold mb-2 text-slate-900">
            Register as Provider
          </h2>
          <p className="text-slate-500 mb-8">
            Create your professional fitness partner account.
          </p>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  className="input-field pl-12 text-sm"
                />
              </div>
            </div>

            {/* Phone + DOB */}
            <div className="grid grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    pattern="[6-9][0-9]{9}"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="input-field pl-12 text-sm"
                  />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  DOB
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dob: e.target.value,
                      })
                    }
                    className="input-field pl-12 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="input-field pl-12 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="input-field pl-12 text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Fitness Category
              </label>
              <select
                value={formData.fitnessCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fitnessCategory: e.target.value,
                  })
                }
                className="input-field text-sm font-bold"
              >
                <option value="gym">Gym</option>
                <option value="yoga">Yoga</option>
                <option value="dance">Dance</option>
                <option value="martial_arts">Martial Arts</option>
                <option value="swimming">Swimming</option>
                <option value="personal_trainer">
                  Personal Trainer
                </option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2"
            >
              {loading
                ? 'Creating Account...'
                : 'Register as Provider'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link
              to="/provider/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 mt-8">
          By signing up, you agree to maintain professional fitness
          standards and valid certifications.
        </p>
      </div>

      {/* Right Side */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop"
          alt="Fitness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="absolute bottom-20 left-20 right-20 text-white">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <h2 className="text-4xl font-bold leading-tight mb-4 text-white">
              Reach More Clients with FitJodhpur
            </h2>
            <p className="text-lg text-white/95 leading-relaxed">
              Manage classes, accept bookings, grow your audience, and build your digital fitness presence with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}