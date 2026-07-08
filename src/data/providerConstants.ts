// ============================================================
// Provider Constants — Categories, fields, and options
// ============================================================
import type { FitnessCategory, CategoryFieldDef } from '../types/providerTypes'

// ============================================================
// FITNESS CATEGORIES
// ============================================================
export interface CategoryInfo {
  id: FitnessCategory
  emoji: string
  label: string
  description: string
}

export const FITNESS_CATEGORIES: CategoryInfo[] = [
  { id: 'gym', emoji: '🏋️', label: 'Gym / Fitness Center', description: 'Strength training, cardio, group fitness' },
  { id: 'yoga', emoji: '🧘', label: 'Yoga Studio', description: 'Hatha, Ashtanga, Power, Prenatal yoga' },
  { id: 'dance', emoji: '💃', label: 'Dance Classes', description: 'Zumba, Bollywood, Hip-Hop, Classical' },
  { id: 'martial_arts', emoji: '🥊', label: 'Martial Arts', description: 'Karate, MMA, Boxing, Taekwondo, Judo' },
  { id: 'swimming', emoji: '🏊', label: 'Swimming Pool / Aquatic Center', description: 'Pools, aquatic training, water sports' },
  { id: 'cycling', emoji: '🚴', label: 'Cycling / Spinning Studio', description: 'Indoor cycling, spinning classes' },
  { id: 'gymnastics', emoji: '🤸', label: 'Gymnastics / Acrobatics', description: 'Artistic gymnastics, tumbling, acro' },
  { id: 'running', emoji: '🏃', label: 'Running / Athletics Coach', description: 'Marathon prep, sprints, athletics' },
  { id: 'nutritionist', emoji: '🍎', label: 'Nutritionist / Dietitian', description: 'Diet plans, nutrition counseling' },
  { id: 'mental_wellness', emoji: '🧠', label: 'Mental Wellness / Meditation', description: 'Meditation, mindfulness, therapy' },
  { id: 'personal_trainer', emoji: '💪', label: 'Personal Trainer', description: 'Home, online, or studio training' },
  { id: 'sports_academy', emoji: '🏒', label: 'Sports Academy', description: 'Cricket, football, basketball, tennis…' },
  { id: 'ayurveda', emoji: '🌿', label: 'Ayurveda / Holistic Wellness', description: 'Traditional healing, panchakarma' },
  { id: 'crossfit', emoji: '🎽', label: 'CrossFit / Functional Training', description: 'High-intensity functional workouts' },
  { id: 'online_coach', emoji: '📱', label: 'Online Fitness Coach', description: 'App-based or video call training' },
  { id: 'other', emoji: '➕', label: 'Other', description: 'Custom fitness service category' },
]

// ============================================================
// CATEGORY-SPECIFIC FIELDS
// ============================================================
export const CATEGORY_SPECIFIC_FIELDS: Record<string, CategoryFieldDef[]> = {
  gym: [
    { key: 'equipmentList', label: 'Equipment Available', type: 'textarea', placeholder: 'List major equipment (e.g., Bench press, Squat rack, Smith machine…)' },
    { key: 'hasAC', label: 'Air Conditioned', type: 'toggle' },
    { key: 'hasLocker', label: 'Locker Facility', type: 'toggle' },
    { key: 'hasSteam', label: 'Steam / Sauna Room', type: 'toggle' },
    { key: 'hasParking', label: 'Parking Available', type: 'toggle' },
  ],
  yoga: [
    { key: 'yogaStyles', label: 'Yoga Styles Offered', type: 'multiselect', options: ['Hatha', 'Ashtanga', 'Power Yoga', 'Vinyasa', 'Yin', 'Prenatal', 'Therapeutic', 'Kundalini', 'Iyengar'] },
    { key: 'indoorOutdoor', label: 'Setting', type: 'select', options: ['Indoor', 'Outdoor', 'Both'] },
  ],
  dance: [
    { key: 'danceStyles', label: 'Dance Styles Offered', type: 'multiselect', options: ['Zumba', 'Bollywood', 'Hip-Hop', 'Classical (Bharatnatyam)', 'Classical (Kathak)', 'Salsa', 'Contemporary', 'Jazz', 'Ballet', 'Folk'] },
    { key: 'hasCompetition', label: 'Performance / Competition Training', type: 'toggle' },
  ],
  martial_arts: [
    { key: 'artForms', label: 'Martial Arts Forms', type: 'multiselect', options: ['Karate', 'MMA', 'Boxing', 'Taekwondo', 'Judo', 'Brazilian Jiu-Jitsu', 'Muay Thai', 'Kickboxing', 'Kung Fu', 'Krav Maga'] },
    { key: 'hasBeltSystem', label: 'Belt / Level System', type: 'toggle' },
    { key: 'hasCompetition', label: 'Competition Training', type: 'toggle' },
    { key: 'selfDefenseFocus', label: 'Self-Defense Focus', type: 'toggle' },
  ],
  swimming: [
    { key: 'poolSize', label: 'Pool Size', type: 'text', placeholder: 'e.g., 25m × 12m' },
    { key: 'isHeated', label: 'Heated Pool', type: 'toggle' },
    { key: 'hasKidsBatch', label: 'Kids Batches Available', type: 'toggle' },
    { key: 'hasCompetition', label: 'Competition Training', type: 'toggle' },
  ],
  sports_academy: [
    { key: 'sportsOffered', label: 'Sports Offered', type: 'multiselect', options: ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Table Tennis', 'Volleyball', 'Hockey', 'Kabaddi', 'Athletics'] },
    { key: 'groundType', label: 'Ground / Court Type', type: 'select', options: ['Indoor', 'Outdoor', 'Both'] },
    { key: 'teamOrIndividual', label: 'Training Type', type: 'select', options: ['Team Sports', 'Individual Sports', 'Both'] },
  ],
  nutritionist: [
    { key: 'dietTypes', label: 'Diet Types Offered', type: 'multiselect', options: ['Keto', 'Vegan', 'Vegetarian', 'Medical Diet', 'Weight Loss', 'Weight Gain', 'Sports Nutrition', 'Ayurvedic Diet', 'Diabetic Diet'] },
    { key: 'hasOnlineConsultation', label: 'Online Consultation Available', type: 'toggle' },
  ],
  personal_trainer: [
    { key: 'trainingLocation', label: 'Training Location', type: 'multiselect', options: ['Home Visits', 'Online Sessions', 'Studio / Gym'] },
    { key: 'specialization', label: 'Specialization', type: 'multiselect', options: ['Weight Loss', 'Muscle Gain', 'Rehabilitation', 'Sports Performance', 'Flexibility', 'Posture Correction', 'Senior Fitness', 'Pre/Post Natal'] },
  ],
  mental_wellness: [
    { key: 'sessionFormat', label: 'Session Format', type: 'select', options: ['1-on-1', 'Group Sessions', 'Both'] },
    { key: 'deliveryMode', label: 'Delivery Mode', type: 'select', options: ['Online', 'Offline', 'Both'] },
  ],
  online_coach: [
    { key: 'platformUsed', label: 'Platform Used', type: 'multiselect', options: ['Zoom', 'Google Meet', 'Custom App', 'WhatsApp Video', 'YouTube Live', 'Instagram Live'] },
    { key: 'programDuration', label: 'Program Duration', type: 'text', placeholder: 'e.g., 4 weeks, 12 weeks, ongoing' },
  ],
  cycling: [
    { key: 'bikeTypes', label: 'Bike Types Available', type: 'multiselect', options: ['Spinning Bikes', 'Road Bikes', 'Mountain Bikes', 'Stationary Bikes'] },
    { key: 'hasOutdoorRides', label: 'Outdoor Group Rides', type: 'toggle' },
  ],
  gymnastics: [
    { key: 'disciplinesOffered', label: 'Disciplines', type: 'multiselect', options: ['Artistic Gymnastics', 'Rhythmic Gymnastics', 'Tumbling', 'Trampoline', 'Acrobatics', 'Parkour'] },
    { key: 'hasCompetition', label: 'Competition Training', type: 'toggle' },
  ],
  running: [
    { key: 'runningTypes', label: 'Training Types', type: 'multiselect', options: ['Marathon Prep', 'Sprint Training', '5K/10K Training', 'Trail Running', 'Track & Field', 'Beginner Running'] },
    { key: 'hasGroupRuns', label: 'Group Running Sessions', type: 'toggle' },
  ],
  crossfit: [
    { key: 'equipmentAvailable', label: 'Equipment Available', type: 'multiselect', options: ['Pull-up Rigs', 'Olympic Bars', 'Kettlebells', 'Rowing Machines', 'Assault Bikes', 'Ropes', 'Plyometric Boxes'] },
    { key: 'hasCompetition', label: 'Competition Preparation', type: 'toggle' },
  ],
  ayurveda: [
    { key: 'therapiesOffered', label: 'Therapies Offered', type: 'multiselect', options: ['Panchakarma', 'Abhyanga', 'Shirodhara', 'Nasya', 'Herbal Consultation', 'Diet Therapy', 'Yoga Therapy'] },
    { key: 'hasDoctor', label: 'Ayurvedic Doctor on Staff', type: 'toggle' },
  ],
}

// ============================================================
// SUB-SPECIALIZATIONS BY CATEGORY
// ============================================================
export const SUB_SPECIALIZATIONS: Record<string, string[]> = {
  gym: ['Bodybuilding', 'Powerlifting', 'Calisthenics', 'Functional Training', 'Weight Loss', 'Group Fitness', 'Cardio Focus', 'Women Only Gym'],
  yoga: ['Hatha Yoga', 'Ashtanga Yoga', 'Power Yoga', 'Prenatal Yoga', 'Therapeutic Yoga', 'Kids Yoga', 'Corporate Yoga', 'Yoga Teacher Training'],
  dance: ['Zumba', 'Bollywood', 'Hip-Hop', 'Classical Bharatnatyam', 'Classical Kathak', 'Salsa & Latin', 'Contemporary', 'Jazz', 'Wedding Choreography'],
  martial_arts: ['Karate', 'MMA', 'Boxing', 'Taekwondo', 'Judo', 'Brazilian Jiu-Jitsu', 'Muay Thai', 'Self-Defense', 'Kids Martial Arts'],
  swimming: ['Learn to Swim', 'Competitive Training', 'Water Aerobics', 'Lifeguard Training', 'Kids Swimming', 'Adult Beginners'],
  cycling: ['Indoor Spinning', 'Outdoor Cycling', 'Competitive Cycling', 'Casual Rides'],
  gymnastics: ['Artistic', 'Rhythmic', 'Tumbling', 'Cheerleading', 'Parkour'],
  running: ['Marathon', '5K/10K', 'Sprinting', 'Trail Running', 'Beginner Programs'],
  nutritionist: ['Weight Loss', 'Sports Nutrition', 'Medical Diets', 'Vegan/Vegetarian', 'Child Nutrition'],
  mental_wellness: ['Meditation', 'Mindfulness', 'Stress Management', 'Sleep Therapy', 'Cognitive Behavioral'],
  personal_trainer: ['Weight Loss', 'Muscle Building', 'Rehabilitation', 'Senior Fitness', 'Pre/Post Natal'],
  sports_academy: ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Swimming', 'Athletics'],
  ayurveda: ['Panchakarma', 'Herbal Medicine', 'Diet Therapy', 'Yoga + Ayurveda', 'Detox Programs'],
  crossfit: ['CrossFit WOD', 'Olympic Lifting', 'Endurance', 'Beginners CrossFit', 'Competition Prep'],
  online_coach: ['Live Sessions', 'Pre-recorded Programs', 'Hybrid Coaching', '1-on-1 Online', 'Group Online'],
  other: [],
}

// ============================================================
// COMMON OPTIONS
// ============================================================
export const LANGUAGES = [
  'Hindi', 'English', 'Marwari', 'Rajasthani', 'Punjabi', 'Gujarati', 'Urdu', 'Sanskrit', 'Tamil', 'Telugu'
]

export const AGE_GROUP_OPTIONS = [
  { value: 'kids', label: 'Kids (5-12)' },
  { value: 'teens', label: 'Teens (13-17)' },
  { value: 'adults', label: 'Adults (18-55)' },
  { value: 'seniors', label: 'Senior Citizens (55+)' },
  { value: 'all', label: 'All Age Groups' },
]

export const GENDER_PREFERENCE_OPTIONS = [
  { value: 'all', label: 'All Genders' },
  { value: 'male_only', label: 'Male Only' },
  { value: 'female_only', label: 'Female Only' },
]

export const AREAS_JODHPUR = [
  'Ratanada', 'Paota', 'Sardarpura', 'Pal', 'Mandore', 'City', 'Rai Ka Bagh',
  'Shastri Nagar', 'Chopasni Road', 'AIIMS Road', 'Pal Road', 'Kamla Nehru Nagar',
  'Banar Road', 'Basni', 'Pratap Nagar', 'Residency Road', 'Baldev Nagar',
  'Panchsheel Colony', 'Jhalamand', 'Shankar Nagar', 'Other'
]

export const PRICING_TEMPLATES: Record<string, Array<{ label: string; price: number; duration: string }>> = {
  gym: [
    { label: 'Monthly', price: 1500, duration: '1 month' },
    { label: '3 Months', price: 4000, duration: '3 months' },
    { label: '6 Months', price: 7000, duration: '6 months' },
    { label: 'Annual', price: 12000, duration: '12 months' },
  ],
  yoga: [
    { label: 'Monthly', price: 800, duration: '1 month' },
    { label: '3 Months', price: 2200, duration: '3 months' },
    { label: 'Per Session', price: 200, duration: 'per session' },
  ],
  dance: [
    { label: 'Monthly', price: 1000, duration: '1 month' },
    { label: '3 Months', price: 2700, duration: '3 months' },
    { label: 'Per Session', price: 300, duration: 'per session' },
  ],
  martial_arts: [
    { label: 'Monthly', price: 1200, duration: '1 month' },
    { label: '3 Months', price: 3200, duration: '3 months' },
    { label: 'Annual', price: 10000, duration: '12 months' },
  ],
  swimming: [
    { label: 'Monthly', price: 1000, duration: '1 month' },
    { label: '3 Months', price: 2800, duration: '3 months' },
    { label: 'Per Session', price: 150, duration: 'per session' },
  ],
  personal_trainer: [
    { label: 'Per Session', price: 500, duration: 'per session' },
    { label: '10 Session Pack', price: 4500, duration: '10 sessions' },
    { label: 'Monthly (12 sessions)', price: 5000, duration: '1 month' },
  ],
  nutritionist: [
    { label: 'Single Consultation', price: 500, duration: 'per session' },
    { label: 'Monthly Plan', price: 2000, duration: '1 month' },
    { label: '3-Month Plan', price: 5000, duration: '3 months' },
  ],
  default: [
    { label: 'Monthly', price: 1000, duration: '1 month' },
    { label: '3 Months', price: 2700, duration: '3 months' },
    { label: 'Per Session', price: 300, duration: 'per session' },
  ],
}
