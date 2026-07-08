import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuthStore } from '../../store/authStore'
import { 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Play, 
  Activity, 
  ChevronRight,
  Sparkles,
  QrCode,
  Dumbbell
} from 'lucide-react'

export default function DashboardOverview() {
  const { user, profile } = useAuthStore()

  // Generate some high-fidelity mock metrics & activities for the dashboard
  const stats = useMemo(() => {
    return {
      totalCheckins: 24,
      classesAttended: 12,
      activePlan: profile?.role === 'member' ? 'All-Access' : 'Free Trial',
      daysLeft: 18,
      streakWeeks: 3
    }
  }, [profile])

  const upcomingClasses = [
    {
      id: 'up-1',
      className: 'Advanced CrossFit',
      centerName: 'Equinox Fitness',
      trainerName: 'Rahul Sharma',
      timeString: 'Tomorrow, 07:00 AM',
      category: 'crossfit'
    },
    {
      id: 'up-2',
      className: 'Vinyasa Flow Yoga',
      centerName: "Priyanka's Yoga Studio",
      trainerName: 'Priyanka Sen',
      timeString: 'Friday, 08:30 AM',
      category: 'yoga'
    }
  ]

  const recentActivities = [
    {
      id: 'act-1',
      title: 'Check-in: Equinox Fitness',
      time: 'Today, 06:15 AM',
      type: 'checkin'
    },
    {
      id: 'act-2',
      title: 'Check-in: Metalix Gym',
      time: 'Yesterday, 07:30 AM',
      type: 'checkin'
    },
    {
      id: 'act-3',
      title: 'Check-in: Anytime Fitness',
      time: 'Oct 24, 06:00 AM',
      type: 'checkin'
    },
    {
      id: 'act-4',
      title: 'Zumba Session Attended',
      time: 'Oct 22, 08:00 AM',
      type: 'class'
    }
  ]

  const displayName = user?.user_metadata?.full_name || profile?.full_name || user?.email?.split('@')[0] || 'member'

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left pb-16">
        
        {/* Welcome Section / Banner */}
        <div className="relative bg-slate-900 rounded-3xl p-8 text-white overflow-hidden shadow-lg shadow-slate-950/10">
          {/* Decorative Graph Line Grid Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 160 Q 200 40 400 180 T 800 60 L 1200 240 L 1200 300 L 0 300 Z" fill="none" stroke="url(#gradient)" strokeWidth="4" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight flex items-center gap-2">
              Welcome back, {displayName}! <span className="animate-bounce">👋</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Your fitness journey is going strong. You've completed 5 sessions this week. Keep it up!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/pass" 
                className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20"
              >
                <QrCode className="w-4 h-4" /> View My FitPass
              </Link>
              <Link 
                to="/explore" 
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-750"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Book a Class
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1: Total Check-ins */}
          <div className="card p-6 flex items-center gap-4 bg-white">
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-2xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Check-ins</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">{stats.totalCheckins}</h4>
            </div>
          </div>

          {/* Card 2: Classes Attended */}
          <div className="card p-6 flex items-center gap-4 bg-white">
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Classes Attended</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">{stats.classesAttended}</h4>
            </div>
          </div>

          {/* Card 3: Active Plan */}
          <div className="card p-6 flex items-center gap-4 bg-white">
            <div className="p-3 bg-orange-50 border border-orange-200 text-primary rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Plan</p>
              <h4 className="text-xl font-black text-slate-900 mt-2">{stats.activePlan}</h4>
            </div>
          </div>

          {/* Card 4: Days Left */}
          <div className="card p-6 flex items-center gap-4 bg-white">
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Days Left</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">{stats.daysLeft}</h4>
            </div>
          </div>
        </div>

        {/* Dynamic Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Upcoming Classes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Upcoming Classes
              </h3>
              <Link to="/explore" className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5">
                View Schedule <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {upcomingClasses.map((item) => (
                <div 
                  key={item.id}
                  className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-primary/10 rounded-2xl text-primary font-bold hidden sm:flex shrink-0">
                      <Dumbbell className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.className}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {item.centerName} • <span className="text-slate-400">Coach {item.trainerName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                      {item.timeString}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Recent Activity Log */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Recent Activity
            </h3>

            <div className="card p-5 bg-white divide-y divide-slate-100">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white ring-2 ring-primary/20 shrink-0"></div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-snug">{act.title}</h5>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Motivational / Tracking Addon Card */}
        <div className="card p-6 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Weekly Activity Streak</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                You've consistently hit your goals for <strong>{stats.streakWeeks} weeks</strong>. Schedule a session today to keep the momentum going!
              </p>
            </div>
          </div>
          <Link 
            to="/explore"
            className="btn-primary px-6 py-2.5 text-xs flex items-center gap-1 shrink-0"
          >
            Find a Gym <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  )
}
