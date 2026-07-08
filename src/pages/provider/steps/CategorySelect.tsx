import React, { useState } from 'react'
import { FITNESS_CATEGORIES } from '../../../data/providerConstants'
import type { FitnessCategory } from '../../../types/providerTypes'
import { Search } from 'lucide-react'

interface CategorySelectProps {
  selected: FitnessCategory | null
  customCategory: string
  onSelect: (category: FitnessCategory) => void
  onChangeCustom: (value: string) => void
}

export default function CategorySelect({ selected, customCategory, onSelect, onChangeCustom }: CategorySelectProps) {
  const [search, setSearch] = useState('')

  const filteredCategories = FITNESS_CATEGORIES.filter(cat => 
    cat.label.toLowerCase().includes(search.toLowerCase()) || 
    cat.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Select Your Fitness Category
        </h2>
        <p className="text-slate-500 text-sm">
          Pick the category that best represents your primary service. We customize your entire profile setup based on this selection.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input 
          type="text"
          className="input-field pl-12 text-sm"
          placeholder="Search categories (e.g. Yoga, CrossFit, MMA)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredCategories.map((cat) => {
          const isSelected = selected === cat.id
          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`cursor-pointer border p-5 rounded-2xl text-center transition-all duration-300 flex flex-col items-center justify-center ${
                isSelected 
                  ? 'bg-primary/5 border-primary shadow-md shadow-primary/5 scale-[1.02]' 
                  : 'bg-white border-slate-250 hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.01]'
              }`}
            >
              <span className="text-4xl mb-3 block transition-transform group-hover:scale-110">
                {cat.emoji}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{cat.label}</h3>
              <p className="text-slate-500 text-xs line-clamp-2">{cat.description}</p>
            </div>
          )
        })}
      </div>

      {/* Custom Category Input if 'other' is selected */}
      {selected === 'other' && (
        <div className="max-w-md mx-auto card p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <label className="block text-sm font-bold text-slate-700 mb-2">Custom Category Name</label>
          <input 
            type="text"
            className="input-field text-sm"
            placeholder="e.g. Pilates Studio, Aqua Aerobics"
            required
            value={customCategory}
            onChange={(e) => onChangeCustom(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
