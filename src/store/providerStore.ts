// ============================================================
// Provider Store — Zustand with localStorage persistence
// ============================================================
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ProviderProfile,
  PricingPlan,
  BatchSchedule,
  Enquiry,
  Review,
  MediaFile,
  YouTubeLink,
  HolidayEntry,
  FitnessCategory,
  OnboardingState,
  ProviderStats,
} from '../types/providerTypes'

// ============================================================
// Demo / Seed Data
// ============================================================
const DEMO_ENQUIRIES: Enquiry[] = [
  { id: 'enq-1', userName: 'Rahul Sharma', userPhone: '9876543210', userEmail: 'rahul@email.com', message: 'Hi, I\'m interested in joining. What are the morning batch timings?', preferredTiming: 'Morning 6-7 AM', status: 'new', createdAt: '2026-05-25T10:30:00Z' },
  { id: 'enq-2', userName: 'Priya Verma', userPhone: '9123456789', message: 'Do you offer a free trial class? I want to try before committing.', status: 'new', createdAt: '2026-05-24T14:15:00Z' },
  { id: 'enq-3', userName: 'Amit Patel', userPhone: '9988776655', userEmail: 'amit.p@gmail.com', message: 'Looking for personal training sessions. What\'s the pricing?', preferredTiming: 'Evening 5-6 PM', status: 'contacted', createdAt: '2026-05-23T09:00:00Z', contactedAt: '2026-05-23T11:00:00Z' },
  { id: 'enq-4', userName: 'Neha Kapoor', userPhone: '8877665544', message: 'Is parking available? Also, do you have women-only batches?', status: 'contacted', createdAt: '2026-05-22T16:45:00Z', contactedAt: '2026-05-22T18:00:00Z' },
  { id: 'enq-5', userName: 'Vikram Singh', userPhone: '7766554433', message: 'My son is 10 years old. Do you have kids\' batches?', preferredTiming: 'Weekend mornings', status: 'follow_up', createdAt: '2026-05-21T08:30:00Z', followUpDate: '2026-05-28' },
  { id: 'enq-6', userName: 'Deepika Rathore', userPhone: '9001122334', userEmail: 'deepika.r@yahoo.com', message: 'Can I get a quarterly membership? Any discounts for students?', status: 'archived', createdAt: '2026-05-18T12:00:00Z' },
  { id: 'enq-7', userName: 'Suresh Kumar', userPhone: '8899001122', message: 'Do you provide diet consultation along with gym membership?', preferredTiming: 'Morning', status: 'new', createdAt: '2026-05-26T08:00:00Z' },
  { id: 'enq-8', userName: 'Kavita Nair', userPhone: '7788990011', message: 'I\'m a beginner. Is there a separate batch for beginners?', status: 'new', createdAt: '2026-05-26T07:30:00Z' },
]

const DEMO_REVIEWS: Review[] = [
  { id: 'rev-1', userName: 'Anjali Singh', userAvatar: '', rating: 5, comment: 'Excellent facility! The trainers are very knowledgeable and supportive. Highly recommend for anyone looking to get fit.', isFlagged: false, createdAt: '2026-05-20T10:00:00Z' },
  { id: 'rev-2', userName: 'Rohan Bhatt', userAvatar: '', rating: 4, comment: 'Good equipment and clean environment. The morning batches can get a bit crowded though. Overall a great experience.', isFlagged: false, createdAt: '2026-05-18T14:30:00Z', reply: 'Thank you Rohan! We\'re adding more morning slots to reduce crowding.', repliedAt: '2026-05-18T16:00:00Z' },
  { id: 'rev-3', userName: 'Manoj Tiwari', userAvatar: '', rating: 5, comment: 'Best gym in Jodhpur! Personal training sessions are worth every penny. Lost 8 kgs in 2 months.', isFlagged: false, createdAt: '2026-05-15T09:00:00Z' },
  { id: 'rev-4', userName: 'Pooja Rao', userAvatar: '', rating: 3, comment: 'Decent gym but parking is a major issue. Equipment needs some upgrades. Staff is friendly though.', isFlagged: false, createdAt: '2026-05-12T11:00:00Z' },
  { id: 'rev-5', userName: 'Arun Mehta', userAvatar: '', rating: 5, comment: 'The Zumba classes here are amazing! Great energy and the instructor makes it so fun. My favorite part of the week!', isFlagged: false, createdAt: '2026-05-10T16:00:00Z' },
  { id: 'rev-6', userName: 'Sita Raman', userAvatar: '', rating: 4, comment: 'Very professional setup. Liked the cleanliness and variety of classes. Would love to see more weekend slots.', isFlagged: false, createdAt: '2026-05-08T08:30:00Z' },
]

import { supabase } from '../lib/supabase'

// ============================================================
// Store Interface
// ============================================================
interface ProviderState {
  // Onboarding
  onboarding: OnboardingState

  // Full profile (after onboarding)
  providerProfile: ProviderProfile | null
  pricingPlans: PricingPlan[]
  batches: BatchSchedule[]
  holidays: HolidayEntry[]
  mediaFiles: MediaFile[]
  youtubeLink: YouTubeLink | null
  hasFreeTrial: boolean
  hasOnlineSessions: boolean

  // Dashboard data
  enquiries: Enquiry[]
  reviews: Review[]

  // Computed helpers
  getStats: () => ProviderStats
  getProfileCompletion: () => number

  // Onboarding actions
  setOnboardingStep: (step: number) => void
  setOnboardingCategory: (category: FitnessCategory) => void
  updateOnboardingProfile: (data: Partial<ProviderProfile>) => void
  completeOnboarding: () => Promise<void>

  // Profile actions
  setProviderProfile: (profile: ProviderProfile) => void
  updateProviderProfile: (data: Partial<ProviderProfile>) => void
  setListingStatus: (status: ProviderProfile['listingStatus']) => void

  // Pricing actions
  addPricingPlan: (plan: PricingPlan) => void
  updatePricingPlan: (id: string, plan: Partial<PricingPlan>) => void
  removePricingPlan: (id: string) => void
  setPricingPlans: (plans: PricingPlan[]) => void

  // Batch actions
  addBatch: (batch: BatchSchedule) => void
  updateBatch: (id: string, batch: Partial<BatchSchedule>) => void
  removeBatch: (id: string) => void
  addHoliday: (holiday: HolidayEntry) => void
  removeHoliday: (id: string) => void

  // Media actions
  addMedia: (file: MediaFile) => void
  removeMedia: (id: string) => void
  setYoutubeLink: (link: YouTubeLink | null) => void

  // Enquiry actions
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void
  addEnquiryNote: (id: string, note: string) => void
  addEnquiry: (enquiry: Enquiry) => void

  // Review actions
  replyToReview: (id: string, reply: string) => void
  flagReview: (id: string) => void

  // Toggles
  setFreeTrial: (value: boolean) => void
  setOnlineSessions: (value: boolean) => void

  // Reset
  resetProvider: () => void
}

const initialOnboarding: OnboardingState = {
  currentStep: 1,
  completedSteps: [],
  category: null,
  profileData: {
    // existing fields plus new trainer & equipment
    trainerName: '',
    trainerPhoto: '',
    trainerSpecialization: '',
    trainerExperience: 0,
    equipment: [],
  },
  pricingPlans: [],
  batches: [],
  mediaFiles: [],
  hasFreeTrial: false,
  hasOnlineSessions: false,
}

export const useProviderStore = create<ProviderState>()(
  persist(
    (set, get) => ({
      // Initial state
      onboarding: initialOnboarding,
      providerProfile: null,
      pricingPlans: [],
      batches: [],
      holidays: [],
      mediaFiles: [],
      youtubeLink: null,
      hasFreeTrial: false,
      hasOnlineSessions: false,
      enquiries: DEMO_ENQUIRIES,
      reviews: DEMO_REVIEWS,

      // Computed
      getStats: () => {
        const state = get()
        const reviews = state.reviews
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0
        return {
          totalViews: 1247,
          totalEnquiries: state.enquiries.length,
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length,
          activeBatches: state.batches.filter(b => b.isActive).length,
          profileCompletion: get().getProfileCompletion(),
        }
      },

      getProfileCompletion: () => {
        const p = get().providerProfile
        if (!p) return 0
        let score = 0
        const total = 14
        if (p.businessName) score++
        if (p.ownerName) score++
        if (p.profilePhoto) score++
        if (p.category) score++
        if (p.contactNumber) score++
        if (p.email) score++
        if (p.bio && p.bio.length > 20) score++
        if (p.languages?.length > 0) score++
        if (p.fullAddress || p.isOnlineOnly) score++
        if (get().pricingPlans.length > 0) score++
        if (get().batches.length > 0) score++
        if (get().mediaFiles.length > 0) score++
        // New trainer & equipment fields
        if (p.trainerName) score++
        if (p.equipment && p.equipment.length > 0) score++
        return Math.round((score / total) * 100)
      },

      // Onboarding actions
      setOnboardingStep: (step) => set((s) => ({
        onboarding: { ...s.onboarding, currentStep: step }
      })),

      setOnboardingCategory: (category) => set((s) => ({
        onboarding: { ...s.onboarding, category, profileData: { ...s.onboarding.profileData, category } }
      })),

      updateOnboardingProfile: (data) => set((s) => ({
        onboarding: { ...s.onboarding, profileData: { ...s.onboarding.profileData, ...data } }
      })),

      completeOnboarding: async () => {
        const state = get()
        const ob = state.onboarding
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No authenticated user')

        // Compute completion score
        let score = 0
        const total = 14
        if (ob.profileData.businessName) score++
        if (ob.profileData.ownerName) score++
        if (ob.profileData.profilePhoto) score++
        if (ob.category) score++
        if (ob.profileData.contactNumber) score++
        if (ob.profileData.email) score++
        if (ob.profileData.bio && ob.profileData.bio.length > 20) score++
        if (ob.profileData.languages && ob.profileData.languages.length > 0) score++
        if (ob.profileData.fullAddress || ob.profileData.isOnlineOnly) score++
        if (ob.pricingPlans.length > 0) score++
        if (ob.batches.length > 0) score++
        if (ob.mediaFiles.length > 0) score++
        if (ob.profileData.trainerName) score++
        if (ob.profileData.equipment && ob.profileData.equipment.length > 0) score++
        const completionPercent = Math.round((score / total) * 100)

        const dbProfile = {
          id: user.id,
          business_name: ob.profileData.businessName || '',
          owner_name: ob.profileData.ownerName || '',
          profile_photo: ob.profileData.profilePhoto || null,
          category: ob.category || 'other',
          custom_category: ob.profileData.customCategory || null,
          sub_specializations: ob.profileData.subSpecializations || [],
          city: ob.profileData.city || 'Jodhpur',
          area: ob.profileData.area || '',
          full_address: ob.profileData.fullAddress || '',
          is_online_only: ob.profileData.isOnlineOnly || false,
          contact_number: ob.profileData.contactNumber || '',
          email: ob.profileData.email || '',
          website: ob.profileData.website || null,
          social_instagram: ob.profileData.socialLinks?.instagram || null,
          social_youtube: ob.profileData.socialLinks?.youtube || null,
          social_facebook: ob.profileData.socialLinks?.facebook || null,
          social_twitter: ob.profileData.socialLinks?.twitter || null,
          languages: ob.profileData.languages || [],
          bio: ob.profileData.bio || '',
          years_of_experience: Number(ob.profileData.yearsOfExperience) || 0,
          gender_preference: ob.profileData.genderPreference || 'all',
          age_groups: ob.profileData.ageGroups || ['all'],
          category_fields: {
            ...ob.profileData.categoryFields,
            trainerName: ob.profileData.trainerName || '',
            trainerPhoto: ob.profileData.trainerPhoto || '',
            trainerSpecialization: ob.profileData.trainerSpecialization || '',
            trainerExperience: Number(ob.profileData.trainerExperience) || 0,
            equipment: ob.profileData.equipment || [],
          },
          listing_status: 'under_review',
          profile_completion_percent: completionPercent,
          has_free_trial: ob.hasFreeTrial,
          has_online_sessions: ob.hasOnlineSessions,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // 1. Insert into provider_profiles table
        const { error: profileError } = await supabase
          .from('provider_profiles')
          .insert([dbProfile])
        if (profileError) throw profileError

        // 2. Insert Pricing Plans (provider_pricing_plans)
        if (ob.pricingPlans.length > 0) {
          const dbPlans = ob.pricingPlans.map(plan => ({
            provider_id: user.id,
            label: plan.label,
            price: Number(plan.price) || 0,
            duration: plan.duration,
            description: plan.description || null,
            is_popular: plan.isPopular || false,
          }))
          const { error: plansError } = await supabase
            .from('provider_pricing_plans')
            .insert(dbPlans)
          if (plansError) console.error('Failed to save plans:', plansError)
        }

        // 3. Insert Batches (provider_batches)
        if (ob.batches.length > 0) {
          const dbBatches = ob.batches.map(batch => ({
            provider_id: user.id,
            day_of_week: batch.dayOfWeek,
            start_time: batch.startTime,
            end_time: batch.endTime,
            capacity: Number(batch.capacity) || 20,
            current_occupancy: Number(batch.currentOccupancy) || 0,
            session_type: batch.sessionType || 'group',
            batch_name: batch.batchName || null,
            is_active: batch.isActive !== false,
          }))
          const { error: batchesError } = await supabase
            .from('provider_batches')
            .insert(dbBatches)
          if (batchesError) console.error('Failed to save batches:', batchesError)
        }

        // 4. Insert Media (provider_media)
        if (ob.mediaFiles.length > 0) {
          const dbMedia = ob.mediaFiles.map(media => ({
            provider_id: user.id,
            type: media.type || 'image',
            url: media.url,
            thumbnail: media.thumbnail || null,
            caption: media.caption || null,
          }))
          const { error: mediaError } = await supabase
            .from('provider_media')
            .insert(dbMedia)
          if (mediaError) console.error('Failed to save media:', mediaError)
        }

        // 5. Insert YouTube Link (provider_youtube_links)
        if (ob.youtubeLink?.url) {
          const dbYoutube = {
            provider_id: user.id,
            url: ob.youtubeLink.url,
            embed_id: ob.youtubeLink.embedId || '',
          }
          const { error: ytError } = await supabase
            .from('provider_youtube_links')
            .insert([dbYoutube])
          if (ytError) console.error('Failed to save YouTube link:', ytError)
        }

        // 6. Insert Certifications (provider_certifications)
        if (ob.profileData.certifications && ob.profileData.certifications.length > 0) {
          const dbCerts = ob.profileData.certifications.map(cert => ({
            provider_id: user.id,
            name: cert.name,
            url: cert.url,
          }))
          const { error: certsError } = await supabase
            .from('provider_certifications')
            .insert(dbCerts)
          if (certsError) console.error('Failed to save certifications:', certsError)
        }

        const profile: ProviderProfile = {
          id: user.id,
          userId: user.id,
          businessName: ob.profileData.businessName || '',
          ownerName: ob.profileData.ownerName || '',
          profilePhoto: ob.profileData.profilePhoto || '',
          category: ob.category || 'other',
          customCategory: ob.profileData.customCategory,
          subSpecializations: ob.profileData.subSpecializations || [],
          city: ob.profileData.city || 'Jodhpur',
          area: ob.profileData.area || '',
          fullAddress: ob.profileData.fullAddress || '',
          isOnlineOnly: ob.profileData.isOnlineOnly || false,
          contactNumber: ob.profileData.contactNumber || '',
          email: ob.profileData.email || '',
          website: ob.profileData.website,
          socialLinks: ob.profileData.socialLinks || {},
          languages: ob.profileData.languages || [],
          bio: ob.profileData.bio || '',
          yearsOfExperience: Number(ob.profileData.yearsOfExperience) || 0,
          certifications: ob.profileData.certifications || [],
          genderPreference: ob.profileData.genderPreference || 'all',
          ageGroups: ob.profileData.ageGroups || ['all'],
          categoryFields: ob.profileData.categoryFields || {},
          trainerName: ob.profileData.trainerName || '',
          trainerPhoto: ob.profileData.trainerPhoto || '',
          trainerSpecialization: ob.profileData.trainerSpecialization || '',
          trainerExperience: Number(ob.profileData.trainerExperience) || 0,
          equipment: ob.profileData.equipment || [],
          listingStatus: 'under_review',
          profileCompletionPercent: completionPercent,
          createdAt: dbProfile.created_at,
          updatedAt: dbProfile.updated_at,
        }

        set({
          providerProfile: profile,
          pricingPlans: ob.pricingPlans,
          batches: ob.batches,
          mediaFiles: ob.mediaFiles,
          youtubeLink: ob.youtubeLink || null,
          hasFreeTrial: ob.hasFreeTrial,
          hasOnlineSessions: ob.hasOnlineSessions,
          onboarding: { ...initialOnboarding, completedSteps: [1, 2, 3, 4] },
        })
      },

      // Profile actions
      setProviderProfile: (profile) => set({ providerProfile: profile }),
      updateProviderProfile: (data) => set((s) => ({
        providerProfile: s.providerProfile ? { ...s.providerProfile, ...data, updatedAt: new Date().toISOString() } : null
      })),
      setListingStatus: (status) => set((s) => ({
        providerProfile: s.providerProfile ? { ...s.providerProfile, listingStatus: status } : null
      })),

      // Pricing
      addPricingPlan: (plan) => set((s) => ({ pricingPlans: [...s.pricingPlans, plan] })),
      updatePricingPlan: (id, plan) => set((s) => ({
        pricingPlans: s.pricingPlans.map(p => p.id === id ? { ...p, ...plan } : p)
      })),
      removePricingPlan: (id) => set((s) => ({ pricingPlans: s.pricingPlans.filter(p => p.id !== id) })),
      setPricingPlans: (plans) => set({ pricingPlans: plans }),

      // Batches
      addBatch: (batch) => set((s) => ({ batches: [...s.batches, batch] })),
      updateBatch: (id, batch) => set((s) => ({
        batches: s.batches.map(b => b.id === id ? { ...b, ...batch } : b)
      })),
      removeBatch: (id) => set((s) => ({ batches: s.batches.filter(b => b.id !== id) })),
      addHoliday: (holiday) => set((s) => ({ holidays: [...s.holidays, holiday] })),
      removeHoliday: (id) => set((s) => ({ holidays: s.holidays.filter(h => h.id !== id) })),

      // Media
      addMedia: (file) => set((s) => ({ mediaFiles: [...s.mediaFiles, file] })),
      removeMedia: (id) => set((s) => ({ mediaFiles: s.mediaFiles.filter(f => f.id !== id) })),
      setYoutubeLink: (link) => set({ youtubeLink: link }),

      // Enquiries
      updateEnquiryStatus: (id, status) => set((s) => ({
        enquiries: s.enquiries.map(e => e.id === id ? {
          ...e,
          status,
          ...(status === 'contacted' ? { contactedAt: new Date().toISOString() } : {})
        } : e)
      })),
      addEnquiryNote: (id, note) => set((s) => ({
        enquiries: s.enquiries.map(e => e.id === id ? { ...e, notes: note } : e)
      })),
      addEnquiry: (enquiry) => set((s) => ({ enquiries: [enquiry, ...s.enquiries] })),

      // Reviews
      replyToReview: (id, reply) => set((s) => ({
        reviews: s.reviews.map(r => r.id === id ? { ...r, reply, repliedAt: new Date().toISOString() } : r)
      })),
      flagReview: (id) => set((s) => ({
        reviews: s.reviews.map(r => r.id === id ? { ...r, isFlagged: true } : r)
      })),

      // Toggles
      setFreeTrial: (value) => set({ hasFreeTrial: value }),
      setOnlineSessions: (value) => set({ hasOnlineSessions: value }),

      // Reset
      resetProvider: () => set({
        onboarding: initialOnboarding,
        providerProfile: null,
        pricingPlans: [],
        batches: [],
        holidays: [],
        mediaFiles: [],
        youtubeLink: null,
        hasFreeTrial: false,
        hasOnlineSessions: false,
        enquiries: DEMO_ENQUIRIES,
        reviews: DEMO_REVIEWS,
      }),
    }),
    {
      name: 'fitjodhpur-provider-store',
    }
  )
)
