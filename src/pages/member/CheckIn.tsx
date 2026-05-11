import { MapPin, History } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

const CheckIn = () => {
  const { user } = useAuthStore()
  const [checkingIn, setCheckingIn] = useState(false)

  const handleManualCheckIn = async () => {
    setCheckingIn(true)
    const { error } = await supabase.from('check_ins').insert({
      member_id: user?.id,
      center_id: '1', // Placeholder: Equinox Fitness
      method: 'manual'
    })

    if (error) {
      toast.error('Check-in failed')
    } else {
      toast.success('Successfully checked in at Equinox Fitness!')
    }
    setCheckingIn(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* QR Code Section */}
        <div className="card p-12 text-center flex flex-col items-center gap-6 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <h2 className="text-2xl font-bold text-slate-900">Your Entry Pass</h2>
          <p className="text-slate-500">Scan this QR code at the center reception to check-in.</p>
          
          <div className="p-6 bg-white border-8 border-slate-50 rounded-3xl shadow-inner">
            <QRCodeSVG 
              value={user?.id || 'fitjodhpur-user'} 
              size={200}
              fgColor="#0f172a"
              level="H"
              includeMargin={false}
            />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Member ID</span>
            <code className="bg-slate-100 px-4 py-2 rounded-lg text-slate-600 font-mono text-sm">
              {user?.id?.slice(0, 8)}...{user?.id?.slice(-8)}
            </code>
          </div>
        </div>

        {/* Demo Manual Check-in */}
        <div className="card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Currently at a center?</p>
              <p className="text-sm text-slate-500">Manual check-in for Equinox Fitness (Demo)</p>
            </div>
          </div>
          <button 
            onClick={handleManualCheckIn}
            disabled={checkingIn}
            className="btn-primary flex items-center gap-2 px-8"
          >
            {checkingIn ? 'Checking in...' : 'Check-in Now'}
          </button>
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <History className="h-5 w-5 text-primary" />
            <h3>Check-in History</h3>
          </div>
          <div className="card divide-y divide-slate-100">
            {[
              { center: 'Equinox Fitness', date: 'Today, 06:15 AM', method: 'QR Scan' },
              { center: 'Metalix Gym', date: 'Yesterday, 07:30 AM', method: 'Manual' },
              { center: 'Equinox Fitness', date: 'Oct 24, 06:00 AM', method: 'QR Scan' }
            ].map((check, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{check.center}</p>
                  <p className="text-sm text-slate-500">{check.date}</p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {check.method}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CheckIn
