import React, { useState } from 'react'
import type { FitnessCategory, PricingPlan } from '../../../types/providerTypes'
import { PRICING_TEMPLATES } from '../../../data/providerConstants'
import { Plus, Trash2, Sparkles } from 'lucide-react'

interface PricingBatchesProps {
  category: FitnessCategory
  pricingPlans: PricingPlan[]
  hasFreeTrial: boolean
  hasOnlineSessions: boolean
  onUpdatePricing: (plans: PricingPlan[]) => void
  onUpdateFreeTrial: (value: boolean) => void
  onUpdateOnlineSessions: (value: boolean) => void
}

export default function PricingBatches({
  category,
  pricingPlans,
  hasFreeTrial,
  hasOnlineSessions,
  onUpdatePricing,
  onUpdateFreeTrial,
  onUpdateOnlineSessions
}: PricingBatchesProps) {
  // Local form state for Pricing
  const [newPlan, setNewPlan] = useState({
    label: '',
    price: 0,
    duration: '1 month',
    description: ''
  })

  // Pre-load templates helper
  const handleLoadTemplates = () => {
    const templates = PRICING_TEMPLATES[category] || PRICING_TEMPLATES.default
    const formatted = templates.map((t, index) => ({
      id: 'plan-template-' + index + '-' + Date.now(),
      label: t.label,
      price: t.price,
      duration: t.duration,
      isPopular: index === 1
    }))
    onUpdatePricing(formatted)
  };

  const handleAddPlan = () => {
    if (!newPlan.label || newPlan.price <= 0) return
    const plan: PricingPlan = {
      id: 'plan-' + Date.now(),
      label: newPlan.label,
      price: newPlan.price,
      duration: newPlan.duration,
      description: newPlan.description,
      isPopular: pricingPlans.length === 0
    }
    onUpdatePricing([...pricingPlans, plan])
    setNewPlan({ label: '', price: 0, duration: '1 month', description: '' })
  }

  const handleRemovePlan = (id: string) => {
    onUpdatePricing(pricingPlans.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-8 text-left">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pricing Structure</h2>
        <p className="text-slate-500 text-sm">Design membership tiers and subscription values for Jodhpur members.</p>
      </div>

      {/* Free Trial & Online Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 border border-slate-200 rounded-xl">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex flex-col pr-4">
            <span className="text-sm font-bold text-slate-900 mb-0.5">Offer Free Trial Class?</span>
            <span className="text-xs text-slate-500">Allow first-time members to experience a class for free.</span>
          </div>
          <input 
            type="checkbox"
            className="sr-only peer"
            checked={hasFreeTrial}
            onChange={(e) => onUpdateFreeTrial(e.target.checked)}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative"></div>
        </label>

        <label className="flex items-center justify-between cursor-pointer border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
          <div className="flex flex-col pr-4">
            <span className="text-sm font-bold text-slate-900 mb-0.5">Provide Online Sessions?</span>
            <span className="text-xs text-slate-500">Offer web-based classes or virtual coaching programs.</span>
          </div>
          <input 
            type="checkbox"
            className="sr-only peer"
            checked={hasOnlineSessions}
            onChange={(e) => onUpdateOnlineSessions(e.target.checked)}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative"></div>
        </label>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Membership & Pricing Plans
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Define your rates (in INR) so users can buy subscriptions directly.</p>
          </div>
          <button
            type="button"
            onClick={handleLoadTemplates}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all self-start sm:self-center"
          >
            <Sparkles className="h-3.5 w-3.5" /> Preset Categories Packages
          </button>
        </div>

        {/* Pricing List */}
        {pricingPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative card p-5 flex flex-col justify-between overflow-hidden shadow-sm ${
                  plan.isPopular ? 'border-primary bg-primary/5' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary text-white uppercase tracking-wider">
                    Popular
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">{plan.label}</h4>
                  <div className="text-2xl font-black text-slate-900 mb-2">
                    ₹{plan.price} <span className="text-slate-400 text-xs font-normal">/ {plan.duration}</span>
                  </div>
                  {plan.description && <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{plan.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePlan(plan.id)}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold self-end"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-slate-500 text-xs mb-6 bg-slate-50/50">
            No pricing plans added yet. Enter a plan below or click 'Preset Categories Packages' for standard options.
          </div>
        )}

        {/* Pricing Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border border-slate-200 bg-slate-50/50 rounded-xl">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Plan Label</label>
            <input 
              type="text"
              placeholder="e.g. Monthly Membership"
              className="input-field text-xs"
              value={newPlan.label}
              onChange={(e) => setNewPlan({ ...newPlan, label: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Price (INR)</label>
            <input 
              type="number"
              placeholder="1500"
              className="input-field text-xs"
              value={newPlan.price || ''}
              onChange={(e) => setNewPlan({ ...newPlan, price: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Duration</label>
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
          <div className="flex items-end justify-between gap-3">
            <div className="flex-grow">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Short Desc (Optional)</label>
              <input 
                type="text"
                placeholder="Include description"
                className="input-field text-xs"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={handleAddPlan}
              className="p-2 rounded-lg bg-primary hover:bg-primary/95 text-white flex items-center justify-center transition-all h-9"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
