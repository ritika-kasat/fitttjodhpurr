import React from 'react'
import { useProviderStore } from '../../../store/providerStore'
import ProfileSetup from '../steps/ProfileSetup'
import { toast } from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function ProviderProfile() {
  const { providerProfile, updateProviderProfile } = useProviderStore()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Studio Profile Details Updated Successfully! ✨')
  }

  if (!providerProfile) {
    return (
      <div className="text-center p-12 text-slate-500">
        No profile active. Please complete onboarding.
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Studio Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your primary search fields, address, area, preferences, and custom category features.</p>
        </div>

        <button
          type="submit"
          className="btn-primary px-5 py-3 text-xs flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" /> Save Profile Details
        </button>
      </div>

      {/* Embed the high-fidelity ProfileSetup component inside a background container */}
      <div className="card p-8">
        <ProfileSetup 
          category={providerProfile.category}
          profileData={providerProfile}
          onChangeProfile={(data) => {
            updateProviderProfile(data)
          }}
        />
      </div>

      {/* Bottom Save Trigger */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="btn-primary px-6 py-3.5 text-xs flex items-center justify-center gap-2"
        >
          <Save className="h-4.5 w-4.5" /> Save Changes
        </button>
      </div>
    </form>
  )
}
