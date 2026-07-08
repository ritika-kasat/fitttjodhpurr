import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Compass, Building2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuthStore();

  useEffect(() => {
    if (user && !loading && profile) {
      if (profile.role === 'provider') {
        navigate('/provider/dashboard');
      } else if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Dumbbell className="h-8 w-8 text-primary animate-pulse" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Fit<span className="text-primary">Jodhpur</span>
          </span>
        </div>
        <span className="text-sm text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Blue City Fitness Hub
        </span>
      </header>

      {/* Main Choice Body */}
      <main className="max-w-5xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center flex-grow relative z-10 text-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-white uppercase leading-none">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Fitness Path</span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-12">
          Unlock the ultimate fitness ecosystem of Jodhpur. Explore local classes or host your own studio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Card 1: User */}
          <div 
            onClick={() => navigate('/login')}
            className="group relative cursor-pointer rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-left transition-all duration-300 hover:border-primary/50 hover:bg-slate-900/80 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col justify-between overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none"></div>
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-all duration-300">
                <Compass className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
                I'm a User
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                I want to explore gym options, attend yoga classes, buy memberships, and transform my lifestyle.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
                Explore local options
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-primary flex items-center justify-center text-slate-300 group-hover:text-white transition-all duration-300">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Fitness Provider */}
          <div 
            onClick={() => navigate('/provider/login')}
            className="group relative cursor-pointer rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-left transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-900/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col justify-between overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none"></div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-all duration-300">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
                I'm a Fitness Provider
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                I want to list my fitness studio (gym, yoga, dance class, martial arts), manage leads, schedules, and reviews.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
                Register & list services
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-blue-500 flex items-center justify-center text-slate-300 group-hover:text-white transition-all duration-300">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-slate-500 text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Role-Based Session Management
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-sm border-t border-slate-900 relative z-10 bg-slate-950/80">
        &copy; {new Date().getFullYear()} FitJodhpur Hub. All rights reserved.
      </footer>
    </div>
  )
}
