import React, { useState } from 'react'
import { useProviderStore } from '../../../store/providerStore'
import type { BatchSchedule, HolidayEntry, DayOfWeek, SessionType } from '../../../types/providerTypes'
import { Clock, Plus, Trash2, Calendar, AlertTriangle, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProviderSchedule() {
  const { providerProfile, batches, holidays, addBatch, removeBatch, addHoliday, removeHoliday } = useProviderStore()

  // Local state for Batch adding form
  const [newBatch, setNewBatch] = useState({
    dayOfWeek: 'Monday' as DayOfWeek,
    startTime: '06:00',
    endTime: '07:00',
    capacity: 20,
    sessionType: 'group' as SessionType,
    batchName: ''
  })

  // Local state for Holiday adding form
  const [newHoliday, setNewHoliday] = useState({
    date: '',
    reason: ''
  })

  if (!providerProfile) {
    return <div className="text-center p-12 text-slate-500">No profile active. Please complete onboarding.</div>
  }

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBatch.startTime || !newBatch.endTime) return

    const batch: BatchSchedule = {
      id: 'batch-' + Date.now(),
      dayOfWeek: newBatch.dayOfWeek,
      startTime: newBatch.startTime,
      endTime: newBatch.endTime,
      capacity: newBatch.capacity,
      currentOccupancy: 0,
      sessionType: newBatch.sessionType,
      batchName: newBatch.batchName.trim() || `${newBatch.sessionType === 'group' ? 'Group Class' : '1-on-1'}`,
      isActive: true
    }

    addBatch(batch)
    setNewBatch({
      dayOfWeek: 'Monday' as DayOfWeek,
      startTime: '06:00',
      endTime: '07:00',
      capacity: 20,
      sessionType: 'group' as SessionType,
      batchName: ''
    })
    toast.success('New Class Batch Scheduled Successfully!')
  }

  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHoliday.date || !newHoliday.reason.trim()) {
      toast.error('Please enter a holiday date and closed reason.')
      return
    }

    const hol: HolidayEntry = {
      id: 'holiday-' + Date.now(),
      date: newHoliday.date,
      reason: newHoliday.reason.trim()
    }

    addHoliday(hol)
    setNewHoliday({ date: '', reason: '' })
    toast.success('Studio Holiday/Closed Date Registered!')
  }

  // Group batches by Day of Week for visual timetable
  const daysList: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">Class Schedule & Availability</h1>
        <p className="text-slate-500 text-sm mt-1">Manage weekly slots, control capacities, and schedule holiday closures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Timetable Scheduler forms */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Add Batch form */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Recurring Batch</h3>
            <form onSubmit={handleAddBatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Batch Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Evening Zumba Flow"
                  className="input-field text-xs"
                  value={newBatch.batchName}
                  onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Day</label>
                  <select
                    className="input-field text-xs font-bold"
                    value={newBatch.dayOfWeek}
                    onChange={(e) => setNewBatch({ ...newBatch, dayOfWeek: e.target.value as DayOfWeek })}
                  >
                    {daysList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Capacity</label>
                  <input 
                    type="number"
                    placeholder="20"
                    className="input-field text-xs"
                    required
                    value={newBatch.capacity || ''}
                    onChange={(e) => setNewBatch({ ...newBatch, capacity: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Start Time</label>
                  <input 
                    type="time"
                    className="input-field text-xs"
                    required
                    value={newBatch.startTime}
                    onChange={(e) => setNewBatch({ ...newBatch, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">End Time</label>
                  <input 
                    type="time"
                    className="input-field text-xs"
                    required
                    value={newBatch.endTime}
                    onChange={(e) => setNewBatch({ ...newBatch, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Format</label>
                <select
                  className="input-field text-xs font-bold"
                  value={newBatch.sessionType}
                  onChange={(e) => setNewBatch({ ...newBatch, sessionType: e.target.value as SessionType })}
                >
                  <option value="group">Group Class</option>
                  <option value="individual">1-on-1 / PT</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4.5 w-4.5" /> Schedule Class
              </button>
            </form>
          </div>

          {/* Add Holiday Closure form */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Holiday Planner
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Register closed dates so members cannot check-in or book schedules on these dates.
            </p>
            <form onSubmit={handleAddHolidaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Closure Date</label>
                <input 
                  type="date"
                  className="input-field text-xs"
                  required
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Reason / Details</label>
                <input 
                  type="text"
                  placeholder="e.g. Closed for Holi Festival"
                  className="input-field text-xs"
                  required
                  value={newHoliday.reason}
                  onChange={(e) => setNewHoliday({ ...newHoliday, reason: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs py-3 flex items-center justify-center gap-1.5 transition-all"
              >
                <Calendar className="h-4 w-4" /> Declare Holiday
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Timetable visualization & Holiday listings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TIMETABLE VIEW */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Weekly Timetable
            </h3>

            {batches.length > 0 ? (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {daysList.map((day) => {
                  const dayBatches = batches.filter(b => b.dayOfWeek === day)
                  if (dayBatches.length === 0) return null
                  return (
                    <div 
                      key={day}
                      className="card p-5"
                    >
                      <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-3">{day} Class Timings</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {dayBatches.map((batch) => (
                          <div 
                            key={batch.id}
                            className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between"
                          >
                            <div>
                              <h5 className="font-bold text-slate-900 text-xs leading-snug">{batch.batchName}</h5>
                              <p className="text-[11px] text-primary font-bold mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3 text-slate-400" /> {batch.startTime} - {batch.endTime}
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5 capitalize">{batch.sessionType} Session • Cap: {batch.capacity}</p>
                            </div>
                            <button
                              onClick={() => removeBatch(batch.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Delete Session"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="card p-12 text-center text-slate-500 text-xs">
                No active class timetables listed. Schedule a recurring batch to display here.
              </div>
            )}
          </div>

          {/* HOLIDAY LISTINGS VIEW */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Declared Holidays & Closed Dates
            </h3>

            {holidays.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {holidays.map((hol) => (
                  <div 
                    key={hol.id}
                    className="flex items-center justify-between card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{hol.reason}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(hol.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeHoliday(hol.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center text-slate-500 text-xs">
                No holidays or closed dates declared. The studio is open 365 days a year.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
