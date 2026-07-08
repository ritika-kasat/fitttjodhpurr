import React, { useState } from 'react'
import type { MediaFile, CertificationFile, YouTubeLink } from '../../../types/providerTypes'
import { Image, Video, FileText, Plus, Trash2, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface MediaUploadProps {
  profilePhoto: string
  mediaFiles: MediaFile[]
  youtubeLink: YouTubeLink | null
  certifications: CertificationFile[]
  onChangeProfilePhoto: (url: string) => void
  onUpdateMedia: (files: MediaFile[]) => void
  onUpdateYoutubeLink: (link: YouTubeLink | null) => void
  onUpdateCertifications: (files: CertificationFile[]) => void
}

export default function MediaUpload({
  profilePhoto,
  mediaFiles,
  youtubeLink,
  certifications,
  onChangeProfilePhoto,
  onUpdateMedia,
  onUpdateYoutubeLink,
  onUpdateCertifications
}: MediaUploadProps) {
  const [photoUrlInput, setPhotoUrlInput] = useState('')
  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [galleryCaption, setGalleryCaption] = useState('')
  const [ytUrlInput, setYtUrlInput] = useState('')
  const [certNameInput, setCertNameInput] = useState('')
  const [certUrlInput, setCertUrlInput] = useState('')

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleSetProfilePhoto = () => {
    if (!photoUrlInput.trim()) return
    onChangeProfilePhoto(photoUrlInput.trim())
    setPhotoUrlInput('')
    toast.success('Business Profile Photo Updated!')
  }

  const handleAddGalleryItem = () => {
    if (!galleryUrlInput.trim()) return
    const file: MediaFile = {
      id: 'media-' + Date.now(),
      type: 'image',
      url: galleryUrlInput.trim(),
      caption: galleryCaption.trim() || 'Fitness Studio Highlight',
      uploadedAt: new Date().toISOString()
    }
    onUpdateMedia([...mediaFiles, file])
    setGalleryUrlInput('')
    setGalleryCaption('')
    toast.success('Gallery photo added!')
  }

  const handleRemoveMedia = (id: string) => {
    onUpdateMedia(mediaFiles.filter(f => f.id !== id))
  }

  const handleAddYoutube = () => {
    const id = extractYoutubeId(ytUrlInput)
    if (!id) {
      toast.error('Invalid YouTube link. Please provide a standard YouTube video watch URL.')
      return
    }
    onUpdateYoutubeLink({
      url: ytUrlInput.trim(),
      embedId: id
    })
    setYtUrlInput('')
    toast.success('YouTube Video Link Registered!')
  }

  const handleAddCert = () => {
    if (!certNameInput.trim() || !certUrlInput.trim()) return
    const cert: CertificationFile = {
      id: 'cert-' + Date.now(),
      name: certNameInput.trim(),
      url: certUrlInput.trim(),
      uploadedAt: new Date().toISOString()
    }
    onUpdateCertifications([...certifications, cert])
    setCertNameInput('')
    setCertUrlInput('')
    toast.success('Certification registered! Pending Verification.')
  }

  const handleRemoveCert = (id: string) => {
    onUpdateCertifications(certifications.filter(c => c.id !== id))
  }

  const handleLoadDemoAssets = () => {
    onChangeProfilePhoto('https://images.unsplash.com/photo-1571902953264-2431f63a39e4?auto=format&fit=crop&q=80&w=300')
    onUpdateYoutubeLink({
      url: 'https://www.youtube.com/watch?v=极速燃脂',
      embedId: 'ysz5S6PUM-U'
    })
    onUpdateMedia([
      { id: 'demo-m1', type: 'image', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600', caption: 'State of the art cardio floor', uploadedAt: new Date().toISOString() },
      { id: 'demo-m2', type: 'image', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600', caption: 'Free weights setup', uploadedAt: new Date().toISOString() }
    ])
    onUpdateCertifications([
      { id: 'demo-c1', name: 'Certified Fitness Instructor (CFI)', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=600', uploadedAt: new Date().toISOString() }
    ])
    toast.success('Loaded high-fidelity mock media assets! ✨')
  }

  return (
    <div className="space-y-8 text-left">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Media & Certifications</h2>
        <p className="text-slate-500 text-sm">Add visuals and certifications to build credibility with Jodhpur's fitness audience.</p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleLoadDemoAssets}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" /> Auto-Load Demo Media
        </button>
      </div>

      {/* Profile Photo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 border border-slate-200 p-6 rounded-xl">
        <div className="md:col-span-1 flex flex-col items-center justify-center border border-slate-200 bg-white p-4 rounded-xl text-center">
          <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Business Photo / Logo</label>
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              className="w-24 h-24 rounded-xl object-cover border-2 border-primary/20 shadow-sm"
              alt="Profile"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Image className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col justify-center space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Add Logo URL</label>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                className="input-field text-xs flex-grow"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSetProfilePhoto}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-750 font-bold text-xs transition-all shrink-0"
              >
                Set Logo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" /> Business Media Gallery
        </h3>
        
        {/* Media Grid */}
        {mediaFiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {mediaFiles.map((file) => (
              <div 
                key={file.id} 
                className="group relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
              >
                <img 
                  src={file.url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt="Gallery"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-2">
                  <p className="text-[10px] text-white truncate font-bold">{file.caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(file.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-white/90 border border-slate-200 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-slate-500 text-xs mb-6 bg-slate-50/50">
            No gallery photos added yet. Enter image URLs below.
          </div>
        )}

        {/* Gallery Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border border-slate-200 bg-slate-50/50 rounded-xl">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Gallery Image URL</label>
            <input 
              type="text"
              placeholder="https://images.unsplash.com/..."
              className="input-field text-xs"
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Image Caption</label>
              <input 
                type="text"
                placeholder="Cardio floor"
                className="input-field text-xs"
                value={galleryCaption}
                onChange={(e) => setGalleryCaption(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleAddGalleryItem}
              className="p-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white flex items-center justify-center transition-all h-9 shrink-0"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* YouTube Video Link */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Video className="h-5 w-5 text-red-500" /> Studio Promo Video
        </h3>
        {youtubeLink ? (
          <div className="card p-5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-24 h-14 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                <Video className="h-6 w-6 text-red-500" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm">YouTube Video Linked</h4>
                <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md">{youtubeLink.url}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateYoutubeLink(null)}
              className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border border-slate-200 bg-slate-50/50 rounded-xl">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">YouTube Video URL</label>
              <input 
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                className="input-field text-xs"
                value={ytUrlInput}
                onChange={(e) => setYtUrlInput(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddYoutube}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="h-4 w-4" /> Link Video
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Professional Credentials
        </h3>

        {/* Certs List */}
        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {certifications.map((cert) => (
              <div 
                key={cert.id}
                className="flex items-center justify-between card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{cert.name}</h4>
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Pending Verification
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(cert.id)}
                  className="text-slate-400 hover:text-red-500 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-slate-500 text-xs mb-6 bg-slate-50/50">
            No certification documents registered. Provide verification documents below.
          </div>
        )}

        {/* Certs Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border border-slate-200 bg-slate-50/50 rounded-xl">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Certification Title</label>
            <input 
              type="text"
              placeholder="e.g. Gold's Gym Personal Trainer Certified"
              className="input-field text-xs"
              value={certNameInput}
              onChange={(e) => setCertNameInput(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Document URL / PDF URL</label>
            <input 
              type="text"
              placeholder="https://certificates.org/..."
              className="input-field text-xs"
              value={certUrlInput}
              onChange={(e) => setCertUrlInput(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddCert}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
