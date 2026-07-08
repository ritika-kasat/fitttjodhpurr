import { useState, useEffect } from 'react'
import { History, CreditCard, ArrowDownCircle, CheckCircle2, XCircle, AlertCircle, Receipt, Download } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'

interface Payment {
  id: string
  amount: number
  status: 'success' | 'failed' | 'pending'
  method: string
  transaction_id: string
  created_at: string
}

const Payments = () => {
  const { user } = useAuthStore()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return
      setLoading(true)
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('member_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payments:', error)
        toast.error('Failed to load transaction history.')
      } else if (data) {
        setPayments(data)
      }
      setLoading(false)
    }

    fetchPayments()
  }, [user])

  const formatAmount = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Fallback demo payments if database is empty
  const displayPayments = payments.length > 0 ? payments : [
    { id: '1', amount: 1499, status: 'success', method: 'UPI (GPay)', transaction_id: 'TXN8765432109', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', amount: 3999, status: 'success', method: 'Credit Card', transaction_id: 'TXN1234567890', created_at: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', amount: 1499, status: 'failed', method: 'UPI (PhonePe)', transaction_id: 'TXN9998887776', created_at: new Date(Date.now() - 93 * 24 * 60 * 60 * 1000).toISOString() }
  ] as Payment[]

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header Widget */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Billing & Payments</h2>
              <p className="text-slate-400 max-w-md">View and manage your membership invoices, payment history, and payment methods.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
              <div className="p-3 bg-primary/20 rounded-xl text-primary">
                <CreditCard className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Default Method</p>
                <p className="font-bold text-sm">UPI / Saved Cards</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5">
             <History className="h-64 w-64 -mb-10 -mr-10" />
          </div>
        </div>

        {/* Payments Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Transaction History
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {displayPayments.length} Total
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                Loading transactions...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {displayPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-slate-600">
                          {payment.transaction_id || payment.id.slice(0, 12).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(payment.created_at)}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-medium">
                          {payment.method || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-bold">
                          {formatAmount(payment.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            payment.status === 'success' ? 'bg-emerald-50 text-emerald-700' :
                            payment.status === 'failed' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {payment.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {payment.status === 'failed' && <XCircle className="w-3.5 h-3.5" />}
                            {payment.status === 'pending' && <AlertCircle className="w-3.5 h-3.5" />}
                            <span className="capitalize">{payment.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {payment.status === 'success' ? (
                            <button 
                              onClick={() => toast.success('Invoice download started!')}
                              className="text-primary hover:text-orange-700 inline-flex items-center gap-1.5 font-bold transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Payments
