import React from 'react'

interface FeedCardProps {
  imageUrl?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function FeedCard({ imageUrl, title, subtitle, actions }: FeedCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:shadow-xl transition-shadow">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-white/70 mb-2">{subtitle}</p>}
        {actions && <div className="flex space-x-2 mt-2">{actions}</div>}
      </div>
    </div>
  )
}
