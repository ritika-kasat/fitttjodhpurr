import React from 'react'
import FeedCard from '../components/FeedCard'

interface FeedItem {
  imageUrl?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

interface FeedGridProps {
  items: FeedItem[]
}

export default function FeedGrid({ items }: FeedGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <FeedCard
          key={idx}
          imageUrl={item.imageUrl}
          title={item.title}
          subtitle={item.subtitle}
          actions={item.actions}
        />
      ))}
    </div>
  )
}
