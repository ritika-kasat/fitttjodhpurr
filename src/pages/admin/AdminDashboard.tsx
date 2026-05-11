import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import DashboardLayout from '../../layouts/DashboardLayout'

const data = [
  { day: 'Mon', checkins: 120 },
  { day: 'Tue', checkins: 150 },
  { day: 'Wed', checkins: 180 },
  { day: 'Thu', checkins: 140 },
  { day: 'Fri', checkins: 210 },
  { day: 'Sat', checkins: 250 },
  { day: 'Sun', checkins: 90 },
]

const pieData = [
  { name: 'All-Access', value: 45 },
  { name: 'Single Center', value: 35 },
  { name: 'Drop-in', value: 20 },
]

const COLORS = ['#E8642C', '#0f172a', '#94a3b8']

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Members', value: '1,248', change: '+12%', icon: Users, positive: true },
    { name: 'Active Subs', value: '856', change: '+5%', icon: CreditCard, positive: true },
    { name: 'Monthly Revenue', value: '₹4.2L', change: '+18%', icon: TrendingUp, positive: true },
    { name: 'Check-ins Today', value: '142', change: '-2%', icon: Activity, positive: false },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                  {stat.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Chart */}
          <div className="card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Daily Check-ins</h3>
              <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg px-3 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="checkins" fill="#E8642C" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Plan Distribution</h3>
            <div className="h-80 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                    <span className="text-sm font-medium text-slate-600">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Management Table (Centers) */}
        <div className="card overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <button className="text-primary font-bold text-sm">View All Logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="px-8 py-4">Center Name</th>
                  <th className="px-8 py-4">Area</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Capacity</th>
                  <th className="px-8 py-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Equinox Fitness', area: 'Ratanada', status: 'Active', capacity: '92%', rating: '4.8' },
                  { name: 'Fitbox Studio', area: 'Paota', status: 'Active', capacity: '65%', rating: '4.5' },
                  { name: 'Metalix Gym', area: 'Sardarpura', status: 'Active', capacity: '78%', rating: '4.7' },
                  { name: 'The Lift Gym', area: 'City', status: 'Maintenance', capacity: '0%', rating: '4.4' },
                ].map((center, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 font-bold text-slate-900">{center.name}</td>
                    <td className="px-8 py-4 text-slate-600">{center.area}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        center.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {center.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-slate-600">{center.capacity}</td>
                    <td className="px-8 py-4 text-slate-900 font-bold">{center.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
