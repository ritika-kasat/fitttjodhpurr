import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Share2, Download, CheckCircle2, ShieldCheck, MapPin, Calendar, QrCode } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { useAuthStore } from '../store/authStore'

const MemberPass = () => {
  const [searchParams] = useSearchParams()
  const { profile } = useAuthStore()
  const planName = searchParams.get('planName') || 'All-Access Pass'
  const userName = searchParams.get('name') || profile?.full_name || 'Member Name'
  
  // Calculate expiration date (30 days from today by default if not specified)
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  const expiryStr = expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-2 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">Your FitPass Digital Card</h1>
              <p className="text-slate-500">Show this card at any partner fitness center for instant entry.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* The Digital Pass - Front */}
            <div className="relative group perspective">
              <div className="relative z-10 w-full aspect-[1.586/1] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-y-12 ring-1 ring-white/20">
                {/* Background Gradient & Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/40"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                
                {/* Content Overlay */}
                <div className="relative h-full p-8 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-primary p-1.5 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">FitJodhpur</span>
                      </div>
                      <p className="text-xs text-white/50 font-bold uppercase tracking-widest ml-1">{planName}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                      <span className="text-sm font-bold">PLATINUM</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Card Holder</p>
                      <p className="text-2xl font-bold tracking-tight truncate">{userName}</p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Valid Thru</p>
                          <p className="text-sm font-bold">{expiryStr}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Member ID</p>
                          <p className="text-sm font-bold">FJ-{Math.floor(100000 + Math.random() * 900000)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                        <ShieldCheck className="h-3 w-3 text-green-400" />
                        <span className="text-[10px] font-bold">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Decoration */}
              <div className="absolute -inset-4 bg-primary/10 blur-3xl -z-10 rounded-full group-hover:bg-primary/20 transition-colors"></div>
            </div>

            {/* Verification Info */}
            <div className="space-y-8">
              <div className="card p-8 text-center border-dashed border-2">
                <div className="bg-slate-50 inline-block p-6 rounded-3xl mb-4">
                  <QrCode className="h-32 w-32 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Scan to Entry</h3>
                <p className="text-slate-500 text-sm">Present this QR code at the reception of any FitJodhpur partner center.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                   <ShieldCheck className="h-5 w-5 text-primary" /> Pass Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: MapPin, text: 'Access to 12+ Centers' },
                    { icon: Calendar, text: 'Unlimited Daily Entry' },
                    { icon: CheckCircle2, text: 'Free Group Classes' },
                    { icon: ShieldCheck, text: 'Priority Support' },
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <benefit.icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl">
                <p className="text-slate-700 text-sm leading-relaxed">
                  <strong>Important:</strong> This digital pass is non-transferable and requires a valid ID proof for verification during your first visit to any new center.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default MemberPass
