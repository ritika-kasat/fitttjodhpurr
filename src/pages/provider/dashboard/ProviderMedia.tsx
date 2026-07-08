import React from 'react'
import { useProviderStore } from '../../../store/providerStore'
import MediaUpload from '../steps/MediaUpload'
import { toast } from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function ProviderMedia() {
  const { providerProfile, mediaFiles, youtubeLink, certifications, updateProviderProfile } = useProviderStore()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Media Gallery Assets Updated Successfully! ✨')
  }

  if (!providerProfile) {
    return <div className="text-center p-12 text-slate-500">No profile active. Please complete onboarding.</div>
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media & Gallery Assets</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your primary business logo, manage image slideshows, embed YouTube videos, and upload credentials.</p>
        </div>

        <button
          type="submit"
          className="btn-primary px-5 py-3 text-xs flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" /> Save Media Assets
        </button>
      </div>

      {/* Embed high-fidelity MediaUpload step coordinators */}
      <div className="card p-8">
        <MediaUpload 
          profilePhoto={providerProfile.profilePhoto || ''}
          mediaFiles={mediaFiles}
          youtubeLink={youtubeLink}
          certifications={certifications || []}
          onChangeProfilePhoto={(url) => updateProviderProfile({ profilePhoto: url })}
          onUpdateMedia={(files) => useProviderStore.setState({ mediaFiles: files })}
          onUpdateYoutubeLink={(link) => useProviderStore.setState({ youtubeLink: link })}
          onUpdateCertifications={(certs) => useProviderStore.setState({ certifications: certs })}
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
