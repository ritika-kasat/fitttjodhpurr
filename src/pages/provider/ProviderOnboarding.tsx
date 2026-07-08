import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProviderStore } from '../../store/providerStore'
import { useAuthStore } from '../../store/authStore';
import CategorySelect from './steps/CategorySelect'
import ProfileSetup from './steps/ProfileSetup'
import PricingBatches from './steps/PricingBatches'
import MediaUpload from './steps/MediaUpload'
import { Dumbbell, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProviderOnboarding() {
  const navigate = useNavigate()

  // Zustand States
  const { onboarding, setOnboardingStep, setOnboardingCategory, updateOnboardingProfile, completeOnboarding } = useProviderStore()
  const { profile } = useAuthStore()

  // Extract variables
  const { currentStep, category, profileData, pricingPlans, batches, mediaFiles, youtubeLink, certifications, hasFreeTrial, hasOnlineSessions } = onboarding

  const nextStep = async () => {
    if (currentStep === 1) {
      if (!category) {
        toast.error('Please select a fitness category to proceed.')
        return
      }
      if (category === 'other' && !profileData.customCategory?.trim()) {
        toast.error('Please enter your custom category name.')
        return
      }
      setOnboardingStep(2)
    } else if (currentStep === 2) {
      if (!profileData.businessName?.trim() || !profileData.ownerName?.trim() || !profileData.contactNumber?.trim() || !profileData.email?.trim() || !profileData.area || !profileData.bio?.trim()) {
        toast.error('Please fill in all required profile fields (Business Name, Owner, Contact Number, Email, Area, and Bio).')
        return
      }
      if (profileData.bio.length < 20) {
        toast.error('Please enter a bio of at least 20 characters.')
        return
      }
      setOnboardingStep(3)
    } else if (currentStep === 3) {
      if (pricingPlans.length === 0) {
        toast.error('Please add at least one membership pricing plan.')
        return
      }
      setOnboardingStep(4)
    } else if (currentStep === 4) {
      if (!profileData.profilePhoto) {
        toast.error('Please provide a profile logo URL in the Media step.')
        return
      }

      // Onboarding complete! Save to store & db
      try {
        await completeOnboarding()
        toast.success('Congratulations! Your studio has been listed. Redirecting to dashboard... 🎉')
        setTimeout(() => {
          navigate('/provider/dashboard')
        }, 1000)
      } catch (err: any) {
        console.error('Onboarding failed:', err)
        toast.error(err.message || 'Failed to complete onboarding. Please try again.')
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setOnboardingStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Fit<span className="text-primary">Provider</span> <span className="text-xs uppercase bg-primary/10 border border-primary/20 text-primary font-bold px-2.5 py-0.5 rounded-full ml-1.5">Onboarding</span>
            </span>
          </div>
          {profile && (
            <span className="text-slate-500 text-xs font-semibold">
              Logged in as: <span className="text-primary">{profile.full_name}</span>
            </span>
          )}
        </div>
      </header>

      {/* Progress Navigator */}
      <div className="max-w-4xl w-full mx-auto px-6 mt-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Step {currentStep} of 4 — Onboarding Progress
            </span>
            <span className="text-sm font-bold text-primary">
              {currentStep === 1 && '1. Choose Category'}
              {currentStep === 2 && '2. Business Details'}
              {currentStep === 3 && '3. Pricing & Timings'}
              {currentStep === 4 && '4. Media & Certificates'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>

          {/* Step Indicator Badges */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-[10px] sm:text-xs font-bold text-center text-slate-400">
            <div className={`flex items-center justify-center gap-1 ${currentStep >= 1 ? 'text-primary' : ''}`}>
              Category {currentStep > 1 && <CheckCircle2 className="h-3 w-3 text-green-600" />}
            </div>
            <div className={`flex items-center justify-center gap-1 ${currentStep >= 2 ? 'text-primary' : ''}`}>
              Details {currentStep > 2 && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
            </div>
            <div className={`flex items-center justify-center gap-1 ${currentStep >= 3 ? 'text-primary' : ''}`}>
              Pricing & Schedules {currentStep > 3 && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
            </div>
            <div className={`flex items-center justify-center gap-1 ${currentStep >= 4 ? 'text-primary' : ''}`}>
              Assets {currentStep > 4 && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
            </div>
          </div>
        </div>
      </div>

      {/* Form Steps Body */}
      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-grow">
        <div className="card p-8 sm:p-12">
          {currentStep === 1 && (
            <CategorySelect
              selected={category}
              customCategory={profileData.customCategory || ''}
              onSelect={setOnboardingCategory}
              onChangeCustom={(val) => updateOnboardingProfile({ customCategory: val })}
            />
          )}

          {currentStep === 2 && category && (
            <ProfileSetup
              category={category}
              profileData={profileData}
              onChangeProfile={updateOnboardingProfile}
            />
          )}

          {currentStep === 3 && category && (
            <PricingBatches
              category={category}
              pricingPlans={pricingPlans}
              hasFreeTrial={hasFreeTrial}
              hasOnlineSessions={hasOnlineSessions}
              onUpdatePricing={(plans) => useProviderStore.setState((s) => ({ onboarding: { ...s.onboarding, pricingPlans: plans } }))}
              onUpdateFreeTrial={(val) => useProviderStore.setState((s) => ({ onboarding: { ...s.onboarding, hasFreeTrial: val } }))}
              onUpdateOnlineSessions={(val) => useProviderStore.setState((s) => ({ onboarding: { ...s.onboarding, hasOnlineSessions: val } }))}
            />
          )}

          {currentStep === 4 && (
            <MediaUpload
              profilePhoto={profileData.profilePhoto || ''}
              mediaFiles={mediaFiles}
              youtubeLink={youtubeLink}
              certifications={certifications || []}
              onChangeProfilePhoto={(url) => updateOnboardingProfile({ profilePhoto: url })}
              onUpdateMedia={(files) => useProviderStore.setState((s) => ({ onboarding: { ...s.onboarding, mediaFiles: files } }))}
              onUpdateYoutubeLink={(link) => useProviderStore.setState((s) => ({ onboarding: { ...s.onboarding, youtubeLink: link } }))}
              onUpdateCertifications={(certs) => useProviderStore.setState((s) => ({ onboarding: { ...s.onboarding, certifications: certs } }))}
            />
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={prevStep}
              className={`inline-flex items-center gap-1.5 px-5 py-3 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''
                }`}
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 px-6 py-3.5 btn-primary"
            >
              {currentStep === 4 ? 'Finish & List Studio' : 'Save & Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} FitJodhpur Provider Services. All rights reserved.
      </footer>
    </div>
  )
}
