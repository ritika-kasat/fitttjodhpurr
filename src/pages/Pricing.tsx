import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Star, Zap, ArrowRight } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

import { generatePlans, FALLBACK_CENTERS } from '../data/pricingData'

const Pricing = () => {
  const [plans, setPlans] = useState<any[]>([])
  const [centers, setCenters] = useState<any[]>([])
  const [tab, setTab] = useState<'all_access' | 'single_center'>('all_access')
  const [selectedCenter, setSelectedCenter] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from('subscription_plans').select('*').order('price_inr'),
        supabase.from('fitness_centers').select('id,name,area,type').eq('is_active', true).order('name'),
      ])

      const usedPlans = p && p.length > 0 ? p : generatePlans()
      const usedCenters = c && c.length > 0 ? c : FALLBACK_CENTERS

      setPlans(usedPlans)
      setCenters(usedCenters)
      if (usedCenters.length) setSelectedCenter(usedCenters[0].id)
      setLoading(false)
    }
    fetchData()
  }, [])

  const allAccessPlans = plans.filter(p => p.plan_type === 'all_access')
  const singleCenterPlans = plans.filter(p => p.plan_type === 'single_center' && p.center_id === selectedCenter)

  const handleSubscribe = (planId: string) => {
    navigate(`/checkout?plan=${planId}`)
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-slate-900 py-20 text-center px-4 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-slate-400 text-xl max-w-xl mx-auto">
            One city. Twelve centers. Pick a plan and start your fitness journey today.
          </p>
          {/* Tab Toggle */}
          <div className="inline-flex bg-white/10 p-1 rounded-2xl mt-10 gap-1">
            {(['all_access', 'single_center'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${tab === t ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'}`}
              >
                {t === 'all_access' ? '🏙 All-Access' : '🏋️ Single Center'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : tab === 'all_access' ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900">Access Every Center in Jodhpur</h2>
              <p className="text-slate-500 mt-2">One membership — all 12 centers, all classes, no restrictions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allAccessPlans.map(p => (
                <div key={p.id} className={`card p-8 flex flex-col ${p.is_featured ? 'ring-2 ring-primary shadow-xl scale-[1.02]' : ''}`}>
                  {p.is_featured && (
                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                      <Zap className="h-4 w-4 fill-current" /> Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">₹{p.price_inr.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 ml-1">/ {p.duration_days === 30 ? 'month' : p.duration_days === 90 ? 'quarter' : 'year'}</span>
                  </div>
                  <ul className="space-y-3 flex-grow mb-8">
                    {p.features?.map((f: string) => (
                      <li key={f} className="flex items-start gap-2 text-slate-600 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe(p.id)}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${p.is_featured ? 'btn-primary' : 'bg-slate-900 text-white hover:bg-slate-700'}`}
                  >
                    Get Started <ArrowRight className="h-4 w-4 inline ml-1" />
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">What's Included</h2>
              <div className="card overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Feature</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700 text-center">Monthly</th>
                      <th className="px-6 py-4 text-sm font-bold text-center" style={{ color: 'var(--color-primary)' }}>Quarterly ⭐</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700 text-center">Annual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ['All 12 Centers', true, true, true],
                      ['Unlimited Classes', true, true, true],
                      ['QR Check-in', true, true, true],
                      ['Guest Pass', '1/month', '1/month', '2/month'],
                      ['Personal Training', false, '1 session', '4 sessions'],
                      ['Nutrition Guide', false, true, true],
                      ['Health Kit', false, false, true],
                      ['Priority Booking', false, false, true],
                    ].map(([feat, m, q, a]) => (
                      <tr key={String(feat)} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 text-slate-700 font-medium text-sm">{feat}</td>
                        {[m, q, a].map((val, i) => (
                          <td key={i} className="px-6 py-3 text-center text-sm">
                            {val === true ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> :
                             val === false ? <span className="text-slate-300">—</span> :
                             <span className="text-slate-600 font-medium">{val}</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Center selector */}
            <div className="mb-10 max-w-sm mx-auto">
              <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Select a Center</label>
              <select
                className="input-field h-14 text-base"
                value={selectedCenter}
                onChange={e => setSelectedCenter(e.target.value)}
              >
                {centers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.area}</option>
                ))}
              </select>
            </div>
            {singleCenterPlans.length === 0 ? (
              <p className="text-center text-slate-500 py-12">No plans for this center yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {singleCenterPlans.map(p => (
                  <div key={p.id} className="card p-6 flex flex-col hover:shadow-lg transition-shadow">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      {p.duration_days === 1 ? 'Drop-In' : p.duration_days === 30 ? 'Monthly' : p.duration_days === 90 ? 'Quarterly' : 'Annual'}
                    </p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-slate-900">₹{p.price_inr.toLocaleString('en-IN')}</span>
                    </div>
                    <ul className="space-y-2 flex-grow mb-6">
                      {p.features?.map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-slate-600 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleSubscribe(p.id)} className="btn-primary w-full py-2.5 text-sm">
                      Subscribe <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I switch between centers anytime?', a: 'Yes! With the All-Access plan, you can visit any of our 12 partner centers on any day without restrictions.' },
              { q: 'What if I want to cancel my subscription?', a: 'You can cancel anytime. Monthly plans are non-refundable for the current month. Quarterly and annual plans offer prorated refunds.' },
              { q: 'Is there a joining fee?', a: 'No joining fees, no hidden charges. The price you see is what you pay.' },
              { q: 'Can I freeze my membership?', a: 'Yes, you can pause your membership for up to 30 days per year at no extra cost.' },
            ].map(faq => (
              <div key={faq.q} className="card p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Pricing
