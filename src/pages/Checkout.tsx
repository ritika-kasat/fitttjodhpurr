import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Building2, Zap, QrCode, Landmark } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { generatePlans } from '../data/pricingData'

// Fallback plans lookup
const ALL_PLANS: Record<string, any> = {}
generatePlans().forEach(p => { ALL_PLANS[p.id] = p })

const Checkout = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const planId = searchParams.get('plan') || ''
  
  const { user, profile } = useAuthStore()
  
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'banktransfer'>('upi')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [utrNumber, setUtrNumber] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txnId, setTxnId] = useState('')

  // Prefill details
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '')
      setEmail(profile.email || user?.email || '')
      setPhone(profile.phone || '')
    } else if (user) {
      setEmail(user.email || '')
    }
  }, [user, profile])

  // Fetch plan details
  useEffect(() => {
    const loadPlan = async () => {
      setLoading(true)
      if (!planId) {
        // Default to FitJodhpur All-Access Quarterly if empty
        setPlan(ALL_PLANS['all-q'])
        setLoading(false)
        return
      }

      // Check if it's a mock plan first
      if (ALL_PLANS[planId]) {
        setPlan(ALL_PLANS[planId])
        setLoading(false)
        return
      }

      // Otherwise, fetch from Supabase
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (!error && data) {
        setPlan(data)
      } else {
        // Fallback to quarterly plan
        setPlan(ALL_PLANS['all-q'])
      }
      setLoading(false)
    }
    loadPlan()
  }, [planId])

  const gst = plan ? Math.round(plan.price_inr * 0.18) : 0
  const total = plan ? plan.price_inr + gst : 0

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be logged in to subscribe to a plan.')
      navigate('/login')
      return
    }

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
    if (paymentMethod === 'banktransfer' && !utrNumber) {
      toast.error('Please enter the UTR / Transaction reference number.')
      return
    }

    setProcessing(true)
    const toastId = toast.loading('Processing secure payment...', { id: 'payment' })
    
    try {
      // 1. Resolve to a valid Database UUID for plan_id if it's mock
      let finalPlanId = plan.id
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(plan.id)
      
      if (!isUuid) {
        // Query database to find a matching plan
        const { data: dbPlans } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('plan_type', plan.plan_type)
          .eq('duration_days', plan.duration_days)
          .limit(1)
        
        if (dbPlans && dbPlans.length > 0) {
          finalPlanId = dbPlans[0].id
        } else {
          // If no matching plan in DB, get any plan to satisfy FK
          const { data: anyPlan } = await supabase
            .from('subscription_plans')
            .select('id')
            .limit(1)
            .single()
          if (anyPlan) {
            finalPlanId = anyPlan.id
          }
        }
      }

      // Generate transaction details
      const generatedTxnId = paymentMethod === 'banktransfer' ? utrNumber : ('TXN' + Math.floor(1000000000 + Math.random() * 9000000000))
      setTxnId(generatedTxnId)

      // Calculate dates
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + (plan.duration_days || 30))

      // 2. Insert into member_subscriptions
      const { data: subscription, error: subError } = await supabase
        .from('member_subscriptions')
        .insert({
          member_id: user.id,
          plan_id: finalPlanId,
          center_id: plan.center_id || null,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          payment_method: paymentMethod === 'banktransfer' ? 'Bank Transfer' : paymentMethod,
          amount_paid: plan.price_inr
        })
        .select()
        .single()

      if (subError) throw subError

      // 3. Insert into payments
      const { error: payError } = await supabase
        .from('payments')
        .insert({
          member_id: user.id,
          subscription_id: subscription.id,
          amount: plan.price_inr,
          status: paymentMethod === 'banktransfer' ? 'pending' : 'success',
          method: paymentMethod === 'banktransfer' ? 'Bank Transfer' : paymentMethod,
          transaction_id: generatedTxnId
        })

      if (payError) throw payError

      // Simulate minor processing delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.dismiss(toastId)
      setSuccess(true)
      toast.success(
        paymentMethod === 'banktransfer'
          ? 'Transfer details submitted! Your pass is pending confirmation. 🎉'
          : 'Payment successful! Your FitPass is ready. 🎉'
      )
    } catch (err: any) {
      console.error('Checkout error:', err)
      toast.dismiss(toastId)
      toast.error('Payment processing failed: ' + (err.message || 'Database error'))
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading checkout details...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (success && plan) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto text-center py-24 px-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            {paymentMethod === 'banktransfer' ? 'Transfer Details Submitted!' : 'Payment Successful!'}
          </h1>
          <p className="text-slate-500 mb-2">
            {paymentMethod === 'banktransfer' 
              ? 'We are verifying your bank transfer. Once confirmed, your subscription to'
              : 'Your subscription to'
            } <strong>{plan.name}</strong> will be active.
          </p>
          <p className="text-slate-500 mb-8">Amount: <strong className="text-slate-900">₹{total.toLocaleString('en-IN')}</strong></p>

          <div className="card p-6 text-left mb-8">
            <h3 className="font-bold text-slate-900 mb-3">Subscription Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="font-medium text-slate-900">{plan.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-medium text-slate-900">{plan.duration_days === 1 ? '1 Day' : plan.duration_days === 30 ? '1 Month' : plan.duration_days === 90 ? '3 Months' : '1 Year'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-900">{name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-900">{email}</span></div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {paymentMethod === 'banktransfer' ? 'UTR Reference No.' : 'Transaction ID'}
                </span>
                <span className="font-medium text-slate-900 font-mono">{txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Status</span>
                <span className={`font-bold uppercase tracking-tight ${paymentMethod === 'banktransfer' ? 'text-amber-600' : 'text-green-600'}`}>
                  {paymentMethod === 'banktransfer' ? 'Pending Approval' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/pass" className="btn-primary px-8 py-3 flex items-center gap-2">
              <QrCode className="h-5 w-5" /> View My FitPass
            </Link>
            <Link to="/dashboard" className="bg-slate-100 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">Go to Dashboard</Link>
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
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary animate-pulse" /> Secure Checkout
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {([
                      { key: 'upi' as const, label: 'UPI', icon: Smartphone },
                      { key: 'card' as const, label: 'Card', icon: CreditCard },
                      { key: 'netbanking' as const, label: 'Net Banking', icon: Building2 },
                      { key: 'banktransfer' as const, label: 'Bank Transfer', icon: Landmark },
                    ]).map(m => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setPaymentMethod(m.key)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 font-bold text-xs transition-all ${paymentMethod === m.key ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        <m.icon className="h-5 w-5" />
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
                            type="password" className="input-field" placeholder="•••" maxLength={3}
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

                  {/* Bank Transfer */}
                  {paymentMethod === 'banktransfer' && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <Landmark className="h-4 w-4 text-primary" /> FitJodhpur Official Bank Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium block">Account Holder Name</span>
                            <span className="font-bold text-slate-900 text-sm">FitJodhpur Fitness Solutions Pvt. Ltd.</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Bank Name</span>
                            <span className="font-bold text-slate-900 text-sm">HDFC Bank Ltd.</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Account Number</span>
                            <span className="font-bold text-slate-900 text-sm font-mono tracking-wider">50200087654321</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">IFSC Code</span>
                            <span className="font-bold text-slate-900 text-sm font-mono tracking-wider">HDFC0001234</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Account Type</span>
                            <span className="font-bold text-slate-900 text-sm">Current Account</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block">Branch</span>
                            <span className="font-bold text-slate-900 text-sm">Ratanada Branch, Jodhpur</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Enter Transaction Ref / UTR Number</label>
                        <input
                          type="text"
                          required
                          className="input-field font-mono uppercase"
                          placeholder="12-digit transaction ID or UTR number"
                          value={utrNumber}
                          onChange={e => setUtrNumber(e.target.value.replace(/\s/g, ''))}
                        />
                        <p className="text-xs text-slate-400">Transfer the total amount via IMPS / NEFT / RTGS to the official bank account above and enter your UTR number to complete check-out.</p>
                      </div>
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
                      {paymentMethod === 'banktransfer' ? 'Confirm Bank Transfer' : `Pay ₹${total.toLocaleString('en-IN')} & Get FitPass`}
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
