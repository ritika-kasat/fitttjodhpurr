import React, { useState } from 'react'
import { useProviderStore } from '../../../store/providerStore'
import { Inbox, Phone, Mail, Clock, MessageSquare, Check, ShieldCheck, FolderArchive, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

type StatusTab = 'all' | 'new' | 'contacted' | 'follow_up' | 'archived'

export default function ProviderLeads() {
  const { enquiries, updateEnquiryStatus, addEnquiryNote } = useProviderStore()
  const [activeTab, setActiveTab] = useState<StatusTab>('new')
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  const filteredLeads = enquiries.filter((e) => {
    if (activeTab === 'all') return true
    return e.status === activeTab
  })

  const handleUpdateStatus = (id: string, status: typeof enquiries[0]['status']) => {
    updateEnquiryStatus(id, status)
    toast.success(`Lead status updated to '${status}'`)
  }

  const handleOpenNotes = (id: string, currentNotes?: string) => {
    setActiveNotesId(id)
    setNoteText(currentNotes || '')
  }

  const handleSaveNotes = (id: string) => {
    addEnquiryNote(id, noteText.trim())
    setActiveNotesId(null)
    setNoteText('')
    toast.success('Lead internal notes saved successfully! 📝')
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">Leads Inbox</h1>
        <p className="text-slate-500 text-sm mt-1">Manage, follow-up and schedule bookings with prospective members.</p>
      </div>

      {/* Tab Filter Links */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {(['new', 'contacted', 'follow_up', 'archived', 'all'] as StatusTab[]).map((tab) => {
          const count = tab === 'all' ? enquiries.length : enquiries.filter(e => e.status === tab).length
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold capitalize transition-all border ${
                active 
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.replace('_', ' ')} <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] ${active ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Leads Grid */}
      {filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id}
              className="card p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{lead.userName}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(lead.createdAt).toLocaleString()}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === 'new' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-green-50 border border-green-200 text-green-700' :
                    lead.status === 'follow_up' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                    'bg-slate-100 border border-slate-200 text-slate-500'
                  }`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-4 text-xs font-medium mb-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{lead.userPhone}</span>
                  </div>
                  {lead.userEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{lead.userEmail}</span>
                    </div>
                  )}
                  {lead.preferredTiming && (
                    <div className="flex items-center gap-2 col-span-2 text-primary">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Preferred Slot: {lead.preferredTiming}</span>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 italic mb-4 leading-relaxed">
                  "{lead.message}"
                </div>

                {/* Internal Notes */}
                {lead.notes && activeNotesId !== lead.id && (
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-xs text-slate-600 mb-4">
                    <span className="text-primary font-bold block uppercase tracking-wider text-[10px] mb-0.5">Internal Notes:</span>
                    {lead.notes}
                  </div>
                )}

                {/* Notes Input */}
                {activeNotesId === lead.id ? (
                  <div className="space-y-2 mb-4">
                    <textarea
                      placeholder="Write notes here..."
                      className="input-field min-h-[60px] text-xs"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveNotesId(null)}
                        className="px-3 py-1.5 text-xs text-slate-500 font-bold hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(lead.id)}
                        className="btn-primary px-3.5 py-1.5 text-xs"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenNotes(lead.id, lead.notes)}
                    className="text-xs text-primary hover:underline font-bold mb-4 inline-block"
                  >
                    {lead.notes ? 'Edit Internal Notes' : '+ Add Internal Follow-up Notes'}
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 mt-2">
                {lead.status !== 'contacted' && (
                  <button
                    onClick={() => handleUpdateStatus(lead.id, 'contacted')}
                    className="flex-1 min-w-[100px] btn-primary px-3.5 py-2 text-xs flex items-center justify-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" /> Contacted
                  </button>
                )}
                {lead.status !== 'follow_up' && (
                  <button
                    onClick={() => handleUpdateStatus(lead.id, 'follow_up')}
                    className="flex-1 min-w-[100px] px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold transition-all flex items-center justify-center gap-1 hover:bg-amber-100"
                  >
                    <Clock className="h-3.5 w-3.5" /> Follow Up
                  </button>
                )}
                {lead.status !== 'archived' && (
                  <button
                    onClick={() => handleUpdateStatus(lead.id, 'archived')}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 text-xs font-bold transition-all"
                    title="Archive Lead"
                  >
                    <FolderArchive className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center max-w-md mx-auto">
          <Inbox className="h-12 w-12 text-slate-300 mb-3 mx-auto" />
          <h4 className="font-bold text-slate-900 text-base mb-1">No Leads Found</h4>
          <p className="text-slate-500 text-xs">There are no leads inside the '{activeTab.replace('_', ' ')}' category.</p>
        </div>
      )}
    </div>
  )
}
