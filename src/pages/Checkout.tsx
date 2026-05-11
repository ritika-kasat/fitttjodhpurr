import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Building2, Zap, QrCode } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { toast } from 'react-hot-toast'

import { generatePlans } from '../data/pricingData'

// Fallback plans lookup
const ALL_PLANS: Record<string, any> = {}
generatePlans().forEach(p => { ALL_PLANS[p.id] = p })

const Checkout = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const planId = searchParams.get('plan') || ''
  const plan = ALL_PLANS[planId]

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const gst = plan ? Math.round(plan.price_inr * 0.18) : 0
  const total = plan ? plan.price_inr + gst : 0

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Payment form submitted', { name, email, phone, paymentMethod })

    if (!name || !email || !phone) {
      toast.error('Please enter your full name, email, and phone number.')
      return
    }
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID (e.g. name@upi)')
      return
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      toast.error('Please fill in all your card details.')
      return
    }

    setProcessing(true)
    toast.loading('Processing secure payment...', { id: 'payment' })
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    toast.dismiss('payment')
    setProcessing(false)
    setSuccess(true)
    toast.success('Payment successful! Your FitPass is ready. 🎉')
  }

  if (!plan) {
    return (
      <MainLayout>
        <div className="text-center py-32">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No plan selected</h2>
          <p className="text-slate-500 mb-8">Please choose a plan from our pricing page first.</p>
          <Link to="/pricing" className="btn-primary px-8 py-3">View Plans</Link>
        </div>
      </MainLayout>
    )
  }

  if (success) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto text-center py-24 px-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Payment Successful!</h1>
          <p className="text-slate-500 mb-2">Your subscription to <strong>{plan.name}</strong> is now active.</p>
          <p className="text-slate-500 mb-8">Amount paid: <strong className="text-slate-900">₹{total.toLocaleString('en-IN')}</strong></p>

          <div className="card p-6 text-left mb-8">
            <h3 className="font-bold text-slate-900 mb-3">Subscription Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="font-medium text-slate-900">{plan.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-medium text-slate-900">{plan.duration_days === 1 ? '1 Day' : plan.duration_days === 30 ? '1 Month' : plan.duration_days === 90 ? '3 Months' : '1 Year'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-900">{name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-900">{email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Transaction ID</span><span className="font-medium text-slate-900">TXN{Date.now()}</span></div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to={`/pass?planName=${encodeURIComponent(plan.name)}&name=${encodeURIComponent(name)}`} className="btn-primary px-8 py-3 flex items-center gap-2">
              <QrCode className="h-5 w-5" /> View My FitPass
            </Link>
            <Link to="/" className="bg-slate-100 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">Go Home</Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Plans
            </button>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" /> Secure Checkout
            </h1>
            <p className="text-slate-500 mt-1">Complete your payment to activate your digital FitPass instantly.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Payment Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handlePayment} className="space-y-8">
                {/* Personal Details */}
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-5">Personal Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                      <input
                        type="text" className="input-field" placeholder="Your full name"
                        value={name} onChange={e => setName(e.target.value)} required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                        <input
                          type="email" className="input-field" placeholder="name@example.com"
                          value={email} onChange={e => setEmail(e.target.value)} required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                        <input
                          type="tel" className="input-field" placeholder="+91 98765 43210"
                          value={phone} onChange={e => setPhone(e.target.value)} required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-5">Payment Method</h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {([
                      { key: 'upi' as const, label: 'UPI', icon: Smartphone },
                      { key: 'card' as const, label: 'Card', icon: CreditCard },
                      { key: 'netbanking' as const, label: 'Net Banking', icon: Building2 },
                    ]).map(m => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setPaymentMethod(m.key)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${paymentMethod === m.key ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        <m.icon className="h-6 w-6" />
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">UPI ID</label>
                        <input
                          type="text" className="input-field" placeholder="yourname@upi"
                          value={upiId} onChange={e => setUpiId(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                          <span key={app} className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-medium">{app}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Card Number</label>
                        <input
                          type="text" className="input-field" placeholder="1234 5678 9012 3456" maxLength={19}
                          value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Expiry</label>
                          <input
                            type="text" className="input-field" placeholder="MM/YY" maxLength={5}
                            value={cardExpiry} onChange={e => {
                              let val = e.target.value.replace(/\D/g, '')
                              if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4)
                              setCardExpiry(val)
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">CVV</label>
                          <input
                            type="password" className="input-field" placeholder="•••" maxLength={4}
                            value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Bank</label>
                      <select className="input-field h-12">
                        <option value="">Choose your bank</option>
                        {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda', 'Kotak Mahindra Bank'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary w-full py-5 text-xl font-bold flex items-center justify-center gap-3 disabled:opacity-60 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {processing ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Securing Payment...
                    </>
                  ) : (
                    <>
                      <Zap className="h-6 w-6" />
                      Pay ₹{total.toLocaleString('en-IN')} & Get FitPass
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secured with 256-bit SSL encryption</span>
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h2>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-500">
                    {plan.duration_days === 1 ? '1 Day Pass' : plan.duration_days === 30 ? '1 Month' : plan.duration_days === 90 ? '3 Months' : '1 Year'} Subscription
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features?.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">₹{plan.price_inr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">GST (18%)</span>
                    <span className="font-medium text-slate-900">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-medium text-green-600">-₹0</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                  {[
                    { icon: '🔒', text: 'Secure Payment' },
                    { icon: '💳', text: 'All Cards Accepted' },
                    { icon: '🔄', text: 'Easy Refunds' },
                    { icon: '📞', text: '24/7 Support' },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{b.icon}</span>
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Checkout
