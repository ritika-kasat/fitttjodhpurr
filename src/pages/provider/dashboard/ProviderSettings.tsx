import React from 'react'
import { useProviderStore } from '../../../store/providerStore'
import { Settings, ShieldCheck, Link2, PlayCircle, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProviderSettings() {
  const { providerProfile, updateProviderProfile, hasFreeTrial, hasOnlineSessions, setFreeTrial, setOnlineSessions } = useProviderStore()

  if (!providerProfile) {
    return <div className="text-center p-12 text-slate-500">No profile active. Please complete onboarding.</div>
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Studio General Settings Saved Successfully! ✨')
  }

  return (
    <form onSubmit={handleSaveSettings} className="space-y-8 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Settings & Control Panel <Settings className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure listing visibility, switch booking formats, and manage social link integrations.</p>
        </div>

        <button
          type="submit"
          className="btn-primary px-5 py-3 text-xs flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </div>

      {/* Box 1: Listing Status Switcher */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Listing Visibility</h3>
        <p className="text-xs text-slate-500">Temporarily pause your listing so users cannot see you or submit enquiries.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['active', 'paused', 'under_review'].map((status) => {
            const isSelected = providerProfile.listingStatus === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  updateProviderProfile({ listingStatus: status as any })
                  toast.success(`Listing visibility set to '${status}'!`)
                }}
                className={`px-4 py-3 rounded-xl border text-xs font-bold capitalize transition-all text-center ${
                  isSelected 
                    ? status === 'active' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm shadow-green-100' :
                      status === 'paused' ? 'bg-slate-200 border-slate-300 text-slate-700 font-bold' :
                      'bg-amber-50 border-amber-500 text-amber-700 shadow-sm shadow-amber-100'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Box 2: Offer Formats Toggles */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Offer Formats</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex items-center justify-between cursor-pointer p-4 border border-slate-200 bg-slate-50/50 rounded-xl hover:border-slate-300 transition-colors">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-bold text-slate-900 mb-0.5">Free Trial Class</span>
              <span className="text-[10px] text-slate-500 leading-normal">Offer first class free to trial members.</span>
            </div>
            <input 
              type="checkbox"
              className="sr-only peer"
              checked={hasFreeTrial}
              onChange={(e) => {
                setFreeTrial(e.target.checked)
                toast.success(`Free trial class toggled!`)
              }}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative"></div>
          </label>

          <label className="flex items-center justify-between cursor-pointer p-4 border border-slate-200 bg-slate-50/50 rounded-xl hover:border-slate-300 transition-colors">
            <div className="flex flex-col pr-4">
              <span className="text-xs font-bold text-slate-900 mb-0.5">Online Coaching Sessions</span>
              <span className="text-[10px] text-slate-500 leading-normal">Advertise live online workouts.</span>
            </div>
            <input 
              type="checkbox"
              className="sr-only peer"
              checked={hasOnlineSessions}
              onChange={(e) => {
                setOnlineSessions(e.target.checked)
                toast.success(`Online coaching format toggled!`)
              }}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative"></div>
          </label>
        </div>
      </div>

      {/* Box 3: Website & Social Integration links */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Digital Links & Social Integrations
        </h3>
        <p className="text-xs text-slate-500">Provide direct external links so students can follow your social handles.</p>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Official Website URL</label>
            <input 
              type="url"
              placeholder="https://www.yourfitnesscenter.com"
              className="input-field text-xs"
              value={providerProfile.website || ''}
              onChange={(e) => updateProviderProfile({ website: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-1.5">
                <Link2 className="h-4 w-4 text-pink-500" /> Instagram Link
              </label>
              <input 
                type="text"
                placeholder="https://instagram.com/goldspart"
                className="input-field text-xs"
                value={providerProfile.socialLinks?.instagram || ''}
                onChange={(e) => updateProviderProfile({ socialLinks: { ...providerProfile.socialLinks, instagram: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-1.5">
                <PlayCircle className="h-4 w-4 text-red-500" /> YouTube Channel Link
              </label>
              <input 
                type="text"
                placeholder="https://youtube.com/@goldschan"
                className="input-field text-xs"
                value={providerProfile.socialLinks?.youtube || ''}
                onChange={(e) => updateProviderProfile({ socialLinks: { ...providerProfile.socialLinks, youtube: e.target.value } })}
              />
            </div>
          </div>
        </div>
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
