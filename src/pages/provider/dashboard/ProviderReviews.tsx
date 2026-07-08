import React, { useState } from 'react'
import { useProviderStore } from '../../../store/providerStore'
import { Star, MessageSquare, CornerDownRight, Flag, Send, User } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProviderReviews() {
  const { reviews, replyToReview, flagReview } = useProviderStore()
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return
    replyToReview(id, replyText.trim())
    setActiveReplyId(null)
    setReplyText('')
    toast.success('Reply submitted successfully!')
  }

  const handleFlagReview = (id: string) => {
    flagReview(id)
    toast.success('Review flagged for content moderation review.')
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">Reviews & Feedback</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor member satisfaction, flag inappropriate reviews, and reply to testimonials.</p>
      </div>

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-6 max-w-3xl">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className={`card p-6 relative overflow-hidden transition-all ${
                rev.isFlagged ? 'border-red-200 bg-red-50/50 opacity-80' : 'hover:shadow-md'
              }`}
            >
              {/* Flagged Banner */}
              {rev.isFlagged && (
                <div className="absolute top-3 right-12 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-red-50 border border-red-200 text-red-500 uppercase tracking-wider">
                  Flagged
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    {rev.userAvatar ? (
                      <img src={rev.userAvatar} className="w-full h-full rounded-full object-cover" alt="User" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{rev.userName}</h3>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3.5 w-3.5 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  {!rev.isFlagged && (
                    <button
                      onClick={() => handleFlagReview(rev.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Flag review as inappropriate"
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-slate-600 text-sm mt-4 leading-relaxed pl-13">
                "{rev.comment}"
              </p>

              {/* Reply Section */}
              <div className="pl-13 mt-6">
                {rev.reply ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3">
                    <CornerDownRight className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-primary text-[10px] font-bold uppercase tracking-wider">Your Reply</span>
                        {rev.repliedAt && (
                          <span className="text-[9px] text-slate-400 font-medium">{new Date(rev.repliedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">"{rev.reply}"</p>
                    </div>
                  </div>
                ) : activeReplyId === rev.id ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Write your professional response to this feedback..."
                      className="input-field min-h-[85px] text-sm"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" /> Submit Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setActiveReplyId(rev.id); setReplyText(''); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all"
                  >
                    <MessageSquare className="h-4 w-4 text-primary" /> Reply to Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center max-w-md mx-auto">
          <MessageSquare className="h-12 w-12 text-slate-300 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-900 text-base mb-1">No Reviews Found</h4>
          <p className="text-slate-500 text-xs">When users browse your studio and complete classes, their testimonials will load here.</p>
        </div>
      )}
    </div>
  )
}
