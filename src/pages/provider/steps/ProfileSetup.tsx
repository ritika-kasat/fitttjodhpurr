import React from 'react'
import type { FitnessCategory, ProviderProfile, GenderPreference, AgeGroup } from '../../../types/providerTypes'
import { CATEGORY_SPECIFIC_FIELDS, SUB_SPECIALIZATIONS, AREAS_JODHPUR, LANGUAGES, GENDER_PREFERENCE_OPTIONS, AGE_GROUP_OPTIONS } from '../../../data/providerConstants'
import { MapPin, Globe, User, Phone, Mail, Award, CheckCircle } from 'lucide-react'

interface ProfileSetupProps {
  category: FitnessCategory
  profileData: Partial<ProviderProfile>
  onChangeProfile: (data: Partial<ProviderProfile>) => void
}

export default function ProfileSetup({ category, profileData, onChangeProfile }: ProfileSetupProps) {
  const currentLanguages = profileData.languages || []
  const currentAgeGroups = profileData.ageGroups || []
  const subSpecializations = profileData.subSpecializations || []
  const categoryFields = profileData.categoryFields || {}

  const toggleLanguage = (lang: string) => {
    if (currentLanguages.includes(lang)) {
      onChangeProfile({ languages: currentLanguages.filter(l => l !== lang) })
    } else {
      onChangeProfile({ languages: [...currentLanguages, lang] })
    }
  }

  const toggleAgeGroup = (group: AgeGroup) => {
    if (currentAgeGroups.includes(group)) {
      onChangeProfile({ ageGroups: currentAgeGroups.filter(g => g !== group) })
    } else {
      onChangeProfile({ ageGroups: [...currentAgeGroups, group] })
    }
  }

  const toggleSpecialization = (spec: string) => {
    if (subSpecializations.includes(spec)) {
      onChangeProfile({ subSpecializations: subSpecializations.filter(s => s !== spec) })
    } else {
      onChangeProfile({ subSpecializations: [...subSpecializations, spec] })
    }
  }

  const handleCategoryFieldChange = (key: string, value: any) => {
    onChangeProfile({
      categoryFields: {
        ...categoryFields,
        [key]: value
      }
    })
  }

  const dynamicFields = CATEGORY_SPECIFIC_FIELDS[category] || []
  const specs = SUB_SPECIALIZATIONS[category] || []

  return (
    <div className="space-y-8 text-left">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Primary Listing & Bio Setup</h2>
        <p className="text-slate-500 text-sm">Tell your clients who you are, where you are located, and what you offer.</p>
      </div>

      {/* Row 1: Names & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Business / Studio Name</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              className="input-field pl-12 text-sm"
              placeholder="e.g. Gold's Gym Paota"
              required
              value={profileData.businessName || ''}
              onChange={(e) => onChangeProfile({ businessName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Owner / Lead Trainer Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              className="input-field pl-12 text-sm"
              placeholder="e.g. Vikram Singh"
              required
              value={profileData.ownerName || ''}
              onChange={(e) => onChangeProfile({ ownerName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience</label>
          <div className="relative">
            <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="number"
              min="0"
              className="input-field pl-12 text-sm"
              placeholder="e.g. 5"
              required
              value={profileData.yearsOfExperience || ''}
              onChange={(e) => onChangeProfile({ yearsOfExperience: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="tel"
              pattern="[6-9][0-9]{9}"
              className="input-field pl-12 text-sm"
              placeholder="9876543210"
              required
              value={profileData.contactNumber || ''}
              onChange={(e) => onChangeProfile({ contactNumber: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Professional Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="email"
              className="input-field pl-12 text-sm"
              placeholder="contact@business.com"
              required
              value={profileData.email || ''}
              onChange={(e) => onChangeProfile({ email: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">About / Business Bio</label>
        <textarea 
          className="input-field text-sm min-h-[90px]"
          placeholder="Briefly describe your fitness program, approach, amenities and highlights..."
          required
          minLength={20}
          value={profileData.bio || ''}
          onChange={(e) => onChangeProfile({ bio: e.target.value })}
        />
      </div>

      {/* Location */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
            <input 
              type="text"
              className="input-field text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
              disabled
              value="Jodhpur"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Area / Suburb</label>
            <select
              className="input-field text-sm"
              required
              value={profileData.area || ''}
              onChange={(e) => onChangeProfile({ area: e.target.value })}
            >
              <option value="">Select Area in Jodhpur</option>
              {AREAS_JODHPUR.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-start md:pt-8">
            <label className="relative flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox"
                className="sr-only peer"
                checked={profileData.isOnlineOnly || false}
                onChange={(e) => onChangeProfile({ isOnlineOnly: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="text-sm font-bold text-slate-700">Is Online Only?</span>
            </label>
          </div>
        </div>

        {!profileData.isOnlineOnly && (
          <div className="mt-4 animate-in fade-in duration-200">
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
            <input 
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Plot No. 12, Residency Road, Opposite Circuit House"
              required={!profileData.isOnlineOnly}
              value={profileData.fullAddress || ''}
              onChange={(e) => onChangeProfile({ fullAddress: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Target Audiences & Languages */}
      <div className="border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gender Preference & Age Groups */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-slate-900">Audience Preferences</h3>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Gender Preference</label>
            <select
              className="input-field text-sm font-bold"
              value={profileData.genderPreference || 'all'}
              onChange={(e) => onChangeProfile({ genderPreference: e.target.value as GenderPreference })}
            >
              {GENDER_PREFERENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Age Groups</label>
            <div className="grid grid-cols-2 gap-3">
              {AGE_GROUP_OPTIONS.map(a => {
                const checked = currentAgeGroups.includes(a.value as AgeGroup)
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => toggleAgeGroup(a.value as AgeGroup)}
                    className={`flex items-center gap-2 p-3 border rounded-xl text-left transition-all ${
                      checked 
                        ? 'border-primary bg-primary/5 text-slate-900 font-bold shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                    }`}
                  >
                    <CheckCircle className={`h-4.5 w-4.5 ${checked ? 'text-primary fill-primary/10' : 'text-slate-300'}`} />
                    <span className="text-xs">{a.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Languages Offered */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Languages Spoken</h3>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map(lang => {
              const checked = currentLanguages.includes(lang)
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`flex items-center gap-2 p-3 border rounded-xl text-left transition-all ${
                    checked 
                      ? 'border-primary bg-primary/5 text-slate-900 font-bold shadow-sm' 
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                  }`}
                >
                  <CheckCircle className={`h-4.5 w-4.5 ${checked ? 'text-primary fill-primary/10' : 'text-slate-300'}`} />
                  <span className="text-xs">{lang}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Category Specific Fields & Sub-Specializations */}
      {(specs.length > 0 || dynamicFields.length > 0) && (
        <div className="border-t border-slate-200 pt-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Specific Services & Features</h3>

          {/* Subspecializations */}
          {specs.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Sub-Specializations Offered</label>
              <div className="flex flex-wrap gap-2.5">
                {specs.map(spec => {
                  const checked = subSpecializations.includes(spec)
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${
                        checked 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {spec}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Dynamic Form Input Elements */}
          {dynamicFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dynamicFields.map((field) => {
                const val = categoryFields[field.key]
                return (
                  <div key={field.key} className="space-y-2">
                    {field.type === 'toggle' ? (
                      <div className="flex items-center justify-between p-4 border border-slate-200 bg-slate-50/50 rounded-xl mt-6">
                        <span className="text-sm font-bold text-slate-700">{field.label}</span>
                        <label className="relative flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            className="sr-only peer"
                            checked={!!val}
                            onChange={(e) => handleCategoryFieldChange(field.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ) : field.type === 'text' ? (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{field.label}</label>
                        <input 
                          type="text"
                          className="input-field text-sm"
                          placeholder={field.placeholder || ''}
                          required={field.required}
                          value={val || ''}
                          onChange={(e) => handleCategoryFieldChange(field.key, e.target.value)}
                        />
                      </div>
                    ) : field.type === 'textarea' ? (
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">{field.label}</label>
                        <textarea 
                          className="input-field text-sm min-h-[80px]"
                          placeholder={field.placeholder || ''}
                          required={field.required}
                          value={val || ''}
                          onChange={(e) => handleCategoryFieldChange(field.key, e.target.value)}
                        />
                      </div>
                    ) : field.type === 'select' ? (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{field.label}</label>
                        <select
                          className="input-field text-sm font-bold"
                          value={val || ''}
                          onChange={(e) => handleCategoryFieldChange(field.key, e.target.value)}
                        >
                          <option value="">Select Option</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    ) : field.type === 'multiselect' ? (
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">{field.label}</label>
                        <div className="flex flex-wrap gap-2">
                          {field.options?.map(opt => {
                            const list = val || []
                            const isIncluded = list.includes(opt)
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  if (isIncluded) {
                                    handleCategoryFieldChange(field.key, list.filter((x: string) => x !== opt))
                                  } else {
                                    handleCategoryFieldChange(field.key, [...list, opt])
                                  }
                                }}
                                className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                                  isIncluded 
                                    ? 'border-primary bg-primary/5 text-primary' 
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                                }`}
                              >
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
              {/* Trainer Details */}
              <div className="mt-6 col-span-1 md:col-span-2 border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Trainer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Trainer Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        className="input-field pl-12 text-sm"
                        placeholder="e.g. Coach Vikram Singh"
                        value={profileData.trainerName || ''}
                        onChange={(e) => onChangeProfile({ trainerName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Specialization</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        className="input-field pl-12 text-sm"
                        placeholder="e.g. Strength & Conditioning"
                        value={profileData.trainerSpecialization || ''}
                        onChange={(e) => onChangeProfile({ trainerSpecialization: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        min="0"
                        className="input-field pl-12 text-sm"
                        placeholder="e.g. 5"
                        value={profileData.trainerExperience || ''}
                        onChange={(e) => onChangeProfile({ trainerExperience: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Equipment List */}
              <div className="mt-6 col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Equipment (comma separated)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    className="input-field pl-12 text-sm"
                    placeholder="e.g. Treadmill, Dumbbells, Yoga Mats"
                    value={profileData.equipment ? profileData.equipment.join(', ') : ''}
                    onChange={(e) => onChangeProfile({ equipment: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
