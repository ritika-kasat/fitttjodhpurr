import { 
  CheckCircle2,
  Calendar as CalendarIcon, 
  Clock, 
  TrendingUp, 
  QrCode
} from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuthStore } from '../../store/authStore'

const DashboardOverview = () => {
  const { profile } = useAuthStore()

  const stats = [
    { name: 'Total Check-ins', value: '24', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Classes Attended', value: '12', icon: CalendarIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Plan', value: 'All-Access', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Days Left', value: '18', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name?.split(' ')[0]}! 👋</h2>
            <p className="text-slate-400 max-w-md">Your fitness journey is going strong. You've completed 5 sessions this week. Keep it up!</p>
            <div className="mt-8 flex items-center gap-4">
              <Link to="/pass" className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-hover transition-all flex items-center gap-2">
                <QrCode className="h-5 w-5" /> View My FitPass
              </Link>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold transition-all">Book a Class</button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
             <TrendingUp className="h-64 w-64 -mb-10 -mr-10" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="card p-6 flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Classes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Upcoming Classes</h3>
              <button className="text-primary font-bold text-sm">View Schedule</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Advanced CrossFit', center: 'Equinox Fitness', time: 'Tomorrow, 07:00 AM', instructor: 'Rahul Sharma' },
                { name: 'Yoga for Beginners', center: 'Sky Fit Gym', time: 'Wed, 06:30 PM', instructor: 'Priya Verma' }
              ].map((cls, i) => (
                <div key={i} className="card p-5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{cls.name}</p>
                      <p className="text-sm text-slate-500">{cls.center} • {cls.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{cls.time}</p>
                    <button className="text-xs text-red-500 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {[
                { type: 'Check-in', detail: 'Equinox Fitness', date: 'Today, 06:15 AM' },
                { type: 'Payment', detail: 'Monthly All-Access Renewed', date: '2 days ago' },
                { type: 'Class', detail: 'Zumba Session Attended', date: '3 days ago' }
              ].map((act, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-white border-2 border-primary z-10"></div>
                  <p className="text-sm font-bold text-slate-900">{act.type}: {act.detail}</p>
                  <p className="text-xs text-slate-500 mt-1">{act.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardOverview
