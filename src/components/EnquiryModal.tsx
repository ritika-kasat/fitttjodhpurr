import React, { useState } from 'react'
import { X, Send, Inbox, Sparkles } from 'lucide-react'
import { useProviderStore } from '../store/providerStore'
import { toast } from 'react-hot-toast'

interface EnquiryModalProps {
  providerId: string
  businessName: string
  onClose: () => void
}

export default function EnquiryModal({ providerId, businessName, onClose }: EnquiryModalProps) {
  const { addEnquiry } = useProviderStore()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    timing: 'Morning',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please enter your name, phone and enquiry message.')
      return
    }

    const enq = {
      id: 'enq-' + Date.now(),
      userName: formData.name.trim(),
      userPhone: formData.phone.trim(),
      userEmail: formData.email.trim() || undefined,
      message: formData.message.trim(),
      preferredTiming: formData.timing,
      status: 'new' as const,
      createdAt: new Date().toISOString()
    }

    addEnquiry(enq)
    setSubmitted(true)
    toast.success('Your Enquiry Sent to the Provider! 🎉')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden font-sans text-left text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
              Enquire Studio <Sparkles className="h-4.5 w-4.5 text-blue-400" />
            </h2>
            <p className="text-[10px] text-slate-400 mt-1">Get in touch with {businessName} directly</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Message Dispatched!</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              Your details were sent to <strong>{businessName}</strong>. Their coach or front desk will contact you at <strong>{formData.phone}</strong> shortly.
            </p>
            <button 
              onClick={onClose} 
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Full Name</label>
              <input 
                type="text"
                placeholder="Rahul Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Phone</label>
                <input 
                  type="tel"
                  placeholder="9876543210"
                  pattern="[6-9][0-9]{9}"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Preferred Slot</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  value={formData.timing}
                  onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Email Address (Optional)</label>
              <input 
                type="email"
                placeholder="name@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Message</label>
              <textarea 
                placeholder="Describe what membership details or class slots you are interested in..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500 min-h-[75px]"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] mt-6"
            >
              <Send className="h-4 w-4" /> Submit Enquiry
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
