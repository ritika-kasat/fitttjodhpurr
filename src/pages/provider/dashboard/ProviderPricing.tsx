import React, { useState } from 'react'
import { useProviderStore } from '../../../store/providerStore'
import { PRICING_TEMPLATES } from '../../../data/providerConstants'
import type { PricingPlan } from '../../../types/providerTypes'
import { Plus, Trash2, Sparkles, Star, ShieldAlert } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProviderPricing() {
  const { providerProfile, pricingPlans, addPricingPlan, removePricingPlan, setPricingPlans, updatePricingPlan } = useProviderStore()

  const [newPlan, setNewPlan] = useState({
    label: '',
    price: 0,
    duration: '1 month',
    description: ''
  })

  if (!providerProfile) {
    return <div className="text-center p-12 text-slate-500">No profile active. Please complete onboarding.</div>
  }

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlan.label || newPlan.price <= 0) {
      toast.error('Please enter a valid label and price.')
      return
    }
    const plan: PricingPlan = {
      id: 'plan-' + Date.now(),
      label: newPlan.label.trim(),
      price: newPlan.price,
      duration: newPlan.duration,
      description: newPlan.description.trim() || undefined,
      isPopular: pricingPlans.length === 0
    }
    addPricingPlan(plan)
    setNewPlan({ label: '', price: 0, duration: '1 month', description: '' })
    toast.success('New Membership Pricing Plan Added!')
  }

  const handleTogglePopular = (id: string) => {
    pricingPlans.forEach(p => {
      updatePricingPlan(p.id, { isPopular: p.id === id })
    })
    toast.success('Popular plan marked!')
  }

  const handleLoadTemplates = () => {
    const templates = PRICING_TEMPLATES[providerProfile.category] || PRICING_TEMPLATES.default
    const formatted = templates.map((t, index) => ({
      id: 'plan-template-' + index + '-' + Date.now(),
      label: t.label,
      price: t.price,
      duration: t.duration,
      isPopular: index === 1
    }))
    setPricingPlans(formatted)
    toast.success(`Standard pricing packages for ${providerProfile.category} loaded!`)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Membership Pricing Plans</h1>
          <p className="text-slate-500 text-sm mt-1">Design subscription models, monthly deals, and drop-in pricing tiers.</p>
        </div>

        <button
          type="button"
          onClick={handleLoadTemplates}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all self-start sm:self-center"
        >
          <Sparkles className="h-4 w-4" /> Load Category Presets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Add Plan Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Custom Plan</h3>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Plan Name</label>
                <input 
                  type="text"
                  placeholder="e.g. 3-Month Premium Pack"
                  className="input-field text-xs"
                  required
                  value={newPlan.label}
                  onChange={(e) => setNewPlan({ ...newPlan, label: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Price (INR)</label>
                <input 
                  type="number"
                  placeholder="₹3500"
                  className="input-field text-xs"
                  required
                  value={newPlan.price || ''}
                  onChange={(e) => setNewPlan({ ...newPlan, price: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Duration Period</label>
                <select
                  className="input-field text-xs font-bold"
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                >
                  <option value="per session">Per Session</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Short Description</label>
                <textarea 
                  placeholder="e.g. Locker and dynamic steam bath access included..."
                  className="input-field text-xs min-h-[70px]"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3.5 flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4.5 w-4.5" /> Register Plan
              </button>
            </form>
          </div>
        </div>

        {/* Right: Active Plans Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-slate-900">Active Memberships</h3>

          {pricingPlans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative card p-6 flex flex-col justify-between overflow-hidden transition-all ${
                    plan.isPopular ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 text-base truncate pr-16">{plan.label}</h4>
                      <button
                        onClick={() => handleTogglePopular(plan.id)}
                        className={`absolute top-4 right-4 p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                          plan.isPopular 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={plan.isPopular ? 'Popular Membership Plan' : 'Mark as Popular'}
                      >
                        <Star className={`h-3.5 w-3.5 ${plan.isPopular ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    <div className="text-3xl font-black text-slate-900 mb-3">
                      ₹{plan.price} <span className="text-slate-400 text-xs font-normal">/ {plan.duration}</span>
                    </div>

                    {plan.description && (
                      <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-100 pt-3 mt-2">{plan.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      {plan.isPopular ? (
                        <>
                          <Star className="h-3 w-3 text-primary fill-primary" /> Featured
                        </>
                      ) : (
                        'Standard'
                      )}
                    </span>
                    <button
                      onClick={() => removePricingPlan(plan.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center text-slate-500 text-xs">
              No active subscription plans registered. Add a membership or load presets to list your prices.
            </div>
          )}

          {/* Secure transaction notice */}
          <div className="flex gap-3 bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs text-slate-500 font-medium items-start leading-relaxed">
            <ShieldAlert className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <p>
              Prices listed here are direct subscription charges visible on search listings. When a student chooses these memberships, we issue them a safe member pass automatically.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
