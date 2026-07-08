// ============================================================
// Provider Types — All TypeScript interfaces for the provider system
// ============================================================

export type FitnessCategory =
  | 'gym'
  | 'yoga'
  | 'dance'
  | 'martial_arts'
  | 'swimming'
  | 'cycling'
  | 'gymnastics'
  | 'running'
  | 'nutritionist'
  | 'mental_wellness'
  | 'personal_trainer'
  | 'sports_academy'
  | 'ayurveda'
  | 'crossfit'
  | 'online_coach'
  | 'other'

export type ListingStatus = 'active' | 'paused' | 'under_review'

export type GenderPreference = 'all' | 'male_only' | 'female_only'

export type AgeGroup = 'kids' | 'teens' | 'adults' | 'seniors' | 'all'

export type SessionType = 'group' | 'individual' | 'both'

export type EnquiryStatus = 'new' | 'contacted' | 'follow_up' | 'archived'

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export type BatchTiming = 'morning' | 'evening' | 'weekend' | 'custom'

// ============================================================
// Provider Profile
// ============================================================
export interface ProviderProfile {
  id: string
  userId: string

  // Basic Info
  businessName: string
  ownerName: string
  profilePhoto: string // base64 or URL
  category: FitnessCategory
  customCategory?: string // when category is 'other'
  subSpecializations: string[]
  // New trainer and equipment fields
  trainerName: string
  trainerPhoto: string // URL or base64
  trainerSpecialization: string
  trainerExperience: number
  equipment: string[]

  // Location
  city: string
  area: string
  fullAddress: string
  isOnlineOnly: boolean
  mapPin?: { lat: number; lng: number }

  // Contact
  contactNumber: string
  email: string
  website?: string
  socialLinks: {
    instagram?: string
    youtube?: string
    facebook?: string
    twitter?: string
  }

  // Details
  languages: string[]
  bio: string
  yearsOfExperience: number
  certifications: CertificationFile[]
  genderPreference: GenderPreference
  ageGroups: AgeGroup[]

  // Category-specific fields (stored as key-value)
  categoryFields: Record<string, any>

  // Status
  listingStatus: ListingStatus
  profileCompletionPercent: number
  createdAt: string
  updatedAt: string
}

export interface CertificationFile {
  id: string
  name: string
  url: string // base64 or URL
  uploadedAt: string
}

// ============================================================
// Pricing
// ============================================================
export interface PricingPlan {
  id: string
  label: string       // e.g., "Monthly", "3 Months", "Per Session"
  price: number       // in INR
  duration: string    // e.g., "1 month", "3 months", "per session"
  description?: string
  isPopular?: boolean
}

// ============================================================
// Batch / Schedule
// ============================================================
export interface BatchSchedule {
  id: string
  dayOfWeek: DayOfWeek
  startTime: string   // HH:mm
  endTime: string     // HH:mm
  capacity: number
  currentOccupancy: number
  sessionType: SessionType
  batchName?: string
  isActive: boolean
}

export interface HolidayEntry {
  id: string
  date: string        // YYYY-MM-DD
  reason: string
}

// ============================================================
// Media
// ============================================================
export interface MediaFile {
  id: string
  type: 'image' | 'video'
  url: string          // base64 or URL
  thumbnail?: string
  caption?: string
  uploadedAt: string
}

export interface YouTubeLink {
  url: string
  embedId: string
}

// ============================================================
// Enquiries / Leads
// ============================================================
export interface Enquiry {
  id: string
  userName: string
  userPhone: string
  userEmail?: string
  message: string
  preferredTiming?: string
  status: EnquiryStatus
  createdAt: string
  contactedAt?: string
  followUpDate?: string
  notes?: string
}

// ============================================================
// Reviews
// ============================================================
export interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number       // 1-5
  comment: string
  reply?: string
  repliedAt?: string
  isFlagged: boolean
  createdAt: string
}

// ============================================================
// Dashboard Stats
// ============================================================
export interface ProviderStats {
  totalViews: number
  totalEnquiries: number
  averageRating: number
  totalReviews: number
  activeBatches: number
  profileCompletion: number
}

// ============================================================
// Onboarding State
// ============================================================
export interface OnboardingState {
  currentStep: number  // 1-4
  completedSteps: number[]
  category: FitnessCategory | null
  profileData: Partial<ProviderProfile>
  pricingPlans: PricingPlan[]
  batches: BatchSchedule[]
  mediaFiles: MediaFile[]
  youtubeLink?: YouTubeLink
  hasFreeTrial: boolean
  hasOnlineSessions: boolean
}

// ============================================================
// Category-Specific Field Definition (for dynamic forms)
// ============================================================
export interface CategoryFieldDef {
  key: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'toggle' | 'textarea'
  options?: string[]
  placeholder?: string
  required?: boolean
}
