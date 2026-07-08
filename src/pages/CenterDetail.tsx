import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Star, Clock, Award, ArrowLeft, CheckCircle2, Users, X, Dumbbell, BadgeCheck, Calendar } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { getTrainers, getEquipment, type Trainer } from '../data/centerData'
import { toast } from 'react-hot-toast'
import { useProviderStore } from '../store/providerStore'
import EnquiryModal from '../components/EnquiryModal'

const TYPE_COLORS: Record<string, string> = {
  gym: 'bg-blue-100 text-blue-700', yoga: 'bg-green-100 text-green-700',
  crossfit: 'bg-red-100 text-red-700', mma: 'bg-purple-100 text-purple-700',
  zumba: 'bg-orange-100 text-orange-700', pilates: 'bg-pink-100 text-pink-700',
  swimming: 'bg-cyan-100 text-cyan-700', dance: 'bg-violet-100 text-violet-700',
  cycling: 'bg-amber-100 text-amber-700', meditation: 'bg-teal-100 text-teal-700',
}

const CATEGORY_LABELS: Record<string, string> = {
  gym: 'Gym', yoga: 'Yoga', crossfit: 'CrossFit', mma: 'MMA', zumba: 'Zumba',
  pilates: 'Pilates', swimming: 'Swimming', dance: 'Dance', cycling: 'Cycling', meditation: 'Meditation',
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Fallback centers (same as Home.tsx)
const FALLBACK_CENTERS: any[] = [
  // Gyms & Fitness Centers
  { id: '1', name: 'Anytime Fitness', type: 'gym', specialization: 'International-standard equipment, Personalized training, Group activities', address: 'Ratanada - 24 Hrs', area: 'Ratanada', rating: 4.8, total_reviews: 320, amenities: ["AC", "24 Hrs", "Parking", "Locker"], image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', opening_time: '12:00 AM', closing_time: '11:59 PM' },
  { id: '2', name: 'Bazooka Fitness', type: 'gym', specialization: 'Modern equipment, Personal training', address: 'Sardarpura', area: 'Sardarpura', rating: 4.6, total_reviews: 180, amenities: ["AC", "Personal Training", "Locker"], image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '10:00 PM' },
  { id: '3', name: 'D Fitness Gym', type: 'gym', specialization: 'Personal training', address: 'Baldev Nagar', area: 'Baldev Nagar', rating: 4.9, total_reviews: 210, amenities: ["AC", "Personal Training", "Parking"], image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '09:30 PM' },
  { id: '4', name: 'Hanuman Fitness Club', type: 'gym', specialization: 'Bodybuilding, Bench Press, Strength Training, Custom diet plans', address: 'Jhalamand Circle', area: 'Jhalamand Circle', rating: 4.7, total_reviews: 500, amenities: ["Strength Equipment", "Diet Counseling", "Parking"], image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800', opening_time: '05:00 AM', closing_time: '10:00 PM' },
  { id: '5', name: 'Bossfit New Level Of Fitness', type: 'gym', specialization: 'Functional training, Personalized fitness', address: 'Shankar Nagar', area: 'Shankar Nagar', rating: 4.8, total_reviews: 150, amenities: ["AC", "Functional Area", "Locker"], image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '09:00 PM' },
  { id: '6', name: 'Equinox Fitness', type: 'gym', specialization: 'In-depth muscle anatomy, Personal training', address: 'Paota', area: 'Paota', rating: 4.8, total_reviews: 450, amenities: ["AC", "Parking", "Locker", "Shower"], image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '10:00 PM' },
  { id: '7', name: 'Metalix Gym', type: 'gym', specialization: 'Functional fitness, Traditional training', address: 'Paota', area: 'Paota', rating: 4.7, total_reviews: 310, amenities: ["AC", "Parking", "Supplement Store"], image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', opening_time: '05:00 AM', closing_time: '10:00 PM' },
  { id: '8', name: 'Trident Fitness', type: 'gym', specialization: 'Strength, Cardio, Group classes', address: 'Rai Ka Bagh', area: 'Rai Ka Bagh', rating: 4.8, total_reviews: 120, amenities: ["Cardio Section", "Group Classes", "Lockers"], image_url: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '09:00 PM' },

  // Yoga Studios & Centers
  { id: '9', name: 'Yoga Guru Karan Singh', type: 'yoga', specialization: 'Traditional yoga, Pilates, Personalized training', address: 'Jodhpur', area: 'Jodhpur', rating: 4.9, total_reviews: 210, amenities: ["Meditation Hall", "Yoga Props", "Parking"], image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },
  { id: '10', name: 'Sai Yogasthali Sansthan', type: 'yoga', specialization: 'Therapeutic Yoga, Naturopathy, Teacher Training', address: 'Various Locations', area: 'Various Locations', rating: 4.8, total_reviews: 320, amenities: ["Naturopathy", "Mats Provided", "Quiet Zone"], image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '07:30 PM' },
  { id: '11', name: "Priyanka's Yoga Studio", type: 'yoga', specialization: "Yoga & Mindfulness, Meditation, Children's yoga", address: 'Ratanada/Pal Road', area: 'Ratanada', rating: 4.7, total_reviews: 140, amenities: ["AC", "Kids Classes", "Mats Provided"], image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },
  { id: '12', name: "Menka's Yogvatika", type: 'yoga', specialization: 'Therapeutic yoga, Beginner classes', address: 'Paota C Road', area: 'Paota', rating: 5.0, total_reviews: 180, amenities: ["Therapy Focus", "Parking", "Quiet Zone"], image_url: 'https://images.unsplash.com/photo-1552286450-5a6c40b165ce?auto=format&fit=crop&q=80&w=800', opening_time: '06:30 AM', closing_time: '07:30 PM' },
  { id: '13', name: 'Satva Yoga Studio', type: 'yoga', specialization: 'Holistic yoga practice', address: 'Panchsheel Colony', area: 'Panchsheel Colony', rating: 4.9, total_reviews: 95, amenities: ["Holistic Approach", "Mats Provided", "AC"], image_url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },
  { id: '14', name: 'Om Yoga Ashram', type: 'yoga', specialization: 'Yoga, Reiki, Meditation, Sound Healing', address: 'Old City', area: 'Old City', rating: 4.8, total_reviews: 200, amenities: ["Sound Healing", "Reiki", "Meditation Hall"], image_url: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&q=80&w=800', opening_time: '05:00 AM', closing_time: '08:00 PM' },
  { id: '15', name: 'Ravinder Kumar', type: 'yoga', specialization: 'Ayurvedic doctor, Certified Yoga Teacher', address: 'Chopasni Road', area: 'Chopasni Road', rating: 4.9, total_reviews: 110, amenities: ["Ayurvedic Consultation", "Parking"], image_url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },

  // Swimming Pools & Coaching
  { id: '16', name: 'Medical College Swimming Pool', type: 'swimming', specialization: 'Olympic-sized pool, Training for all age groups', address: 'Shastri Nagar', area: 'Shastri Nagar', rating: 4.7, total_reviews: 400, amenities: ["Olympic Pool", "Coaching", "Changing Rooms"], image_url: 'https://images.unsplash.com/photo-1576013462273-d130a112245b?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '09:00 PM' },
  { id: '17', name: 'Jodhpur Sports Club', type: 'swimming', specialization: '60x30 ft main pool, Kids pool, Women batches', address: 'Pal Road', area: 'Pal Road', rating: 4.6, total_reviews: 250, amenities: ["Kids Pool", "Women Batches", "Showers"], image_url: 'https://images.unsplash.com/photo-1530549387725-0b0c67da4dd2?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:30 PM' },
  { id: '18', name: 'Aqua Arena Club', type: 'swimming', specialization: 'Specialized swimming training for children', address: 'AIIMS Road', area: 'AIIMS Road', rating: 4.8, total_reviews: 130, amenities: ["Kids Training", "Lockers", "Cafeteria"], image_url: 'https://images.unsplash.com/photo-1600965962102-9d260a71890d?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '09:00 PM' },
  { id: '19', name: 'Scorpion Sports Academy', type: 'swimming', specialization: 'Professional coaching for non-swimmers', address: 'Paota', area: 'Paota', rating: 4.7, total_reviews: 180, amenities: ["Professional Coaching", "Showers"], image_url: 'https://images.unsplash.com/photo-1519315901367-f34f828a2a16?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '08:00 PM' },
  { id: '20', name: 'Sukhani Farms', type: 'swimming', specialization: 'Swimming lessons', address: 'Chokhan', area: 'Chokhan', rating: 4.4, total_reviews: 90, amenities: ["Outdoor Pool", "Parking", "Relaxation Area"], image_url: 'https://images.unsplash.com/photo-1519315901367-f34f828a2a16?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },

  // Dance & Zumba Centres
  { id: '21', name: "Sunil's Dance and Zumba Classes", type: 'zumba', specialization: 'Zumba, Dance Fitness, Hula Hoop, Kids fitness', address: 'Shastri Nagar/Pal Road', area: 'Shastri Nagar', rating: 4.9, total_reviews: 310, amenities: ["AC", "Wooden Floor", "Sound System"], image_url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=800', opening_time: '07:00 AM', closing_time: '09:00 PM' },
  { id: '22', name: 'SK Dance Fitness Studio', type: 'dance', specialization: 'Zumba and dance fitness', address: 'Shastri Nagar', area: 'Shastri Nagar', rating: 4.8, total_reviews: 150, amenities: ["Mirrors", "AC", "Dance Floor"], image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', opening_time: '06:30 AM', closing_time: '08:30 PM' },
  { id: '23', name: 'Musical Beats Dance Studio', type: 'dance', specialization: 'Zumba and various dance forms', address: 'Pal Road', area: 'Pal Road', rating: 4.7, total_reviews: 210, amenities: ["AC", "Sound System", "Parking"], image_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800', opening_time: '08:00 AM', closing_time: '08:00 PM' },
  { id: '24', name: 'Inspire Dance Studio', type: 'zumba', specialization: 'Group Zumba and aerobics sessions', address: 'Paota', area: 'Paota', rating: 4.6, total_reviews: 120, amenities: ["Group Sessions", "AC", "Changing Room"], image_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800', opening_time: '07:00 AM', closing_time: '09:00 PM' },
  { id: '25', name: 'Raja Jolly Dance Academy', type: 'dance', specialization: 'Energetic Zumba and dance workshops', address: 'Sardarpura', area: 'Sardarpura', rating: 4.8, total_reviews: 190, amenities: ["Workshops", "Sound System", "Dance Floor"], image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', opening_time: '09:00 AM', closing_time: '09:00 PM' },
  { id: '26', name: 'Friends Dance Academy', type: 'dance', specialization: 'Dance classes', address: 'Ratanada', area: 'Ratanada', rating: 4.7, total_reviews: 110, amenities: ["AC", "Mirrors", "Sound System"], image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', opening_time: '08:00 AM', closing_time: '08:00 PM' }
];

// Generate fallback schedules for a center
function generateFallbackSchedules(centerId: string, centerType: string) {
  const schedules: any[] = []
  const classNames: Record<string, string[]> = {
    gym: ['Strength Training', 'Cardio Bootcamp', 'Hypertrophy Training', 'Core & Abs'],
    yoga: ['Morning Yoga Flow', 'Pranayama & Meditation', 'Evening Yoga', 'Power Yoga'],
    crossfit: ['CrossFit WOD', 'Functional Fitness', 'Evening WOD', 'CrossFit AMRAP'],
    mma: ['Morning Drills', 'Kickboxing Basics', 'Sparring Session', 'BJJ Fundamentals'],
    zumba: ['Zumba Blast', 'Dance Cardio', 'Zumba Party', 'Aerobics Fusion'],
    pilates: ['Mat Pilates', 'Reformer Pilates', 'Pilates Flow', 'Core Pilates'],
    swimming: ['Lap Swimming', 'Aqua Aerobics', 'Swim Coaching', 'Free Swim'],
    dance: ['Hip-Hop Dance', 'Bollywood Beats', 'Contemporary Dance', 'Free Style'],
    cycling: ['Morning Spin', 'Power Cycling', 'Endurance Ride', 'Interval Sprint'],
    meditation: ['Morning Meditation', 'Mindfulness', 'Guided Healing', 'Deep Breath'],
  }
  const names = classNames[centerType] || classNames['gym']
  const instructors = ['Rahul S.', 'Priya V.']
  const times = [
    { start: '06:00', end: '07:00' },
    { start: '07:00', end: '08:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
  ]

  DAYS.forEach(day => {
    times.forEach((t, i) => {
      schedules.push({
        id: `${centerId}-${day}-${i}`,
        center_id: centerId,
        class_name: names[i],
        instructor_name: instructors[i < 2 ? 0 : 1],
        class_type: centerType,
        day_of_week: day,
        start_time: t.start,
        end_time: t.end,
        max_capacity: i < 2 ? 20 : 25,
        current_bookings: Math.floor(Math.random() * 15),
      })
    })
  })
  return schedules
}

// Generate fallback plans for a center
function generateFallbackPlans(centerId: string, centerName: string, centerType: string, centerRating: number = 4.5) {
  const basePrice: Record<string, number> = {
    crossfit: 2499, mma: 2199, yoga: 1499, zumba: 1299,
    pilates: 1999, swimming: 1799, dance: 1299, cycling: 1499, meditation: 999, gym: 1499,
  }
  let bp = basePrice[centerType] || 1499
  
  // Adjust price based on rating (4.5 rating = base price, 5.0 = premium, <4.5 = discount)
  const ratingMultiplier = (centerRating / 4.5);
  // Add some uniqueness based on center ID
  const uniqueFactor = (parseInt(centerId) * 10);
  bp = Math.round(bp * ratingMultiplier) + uniqueFactor;
  
  // Round to nearest 99 (e.g., 1542 -> 1499 or 1599)
  bp = Math.floor(bp / 100) * 100 + 99;

  return [
    { id: `${centerId}-allm`, name: 'FitJodhpur All-Access Monthly', plan_type: 'all_access', center_id: null,
      duration_days: 30, price_inr: 1999, is_featured: false,
      features: ['Access to all 12 centers', 'Unlimited class bookings', 'QR check-in', 'Free guest pass (1/month)'] },
    { id: `${centerId}-allq`, name: 'FitJodhpur All-Access Quarterly', plan_type: 'all_access', center_id: null,
      duration_days: 90, price_inr: 4999, is_featured: true,
      features: ['Access to all 12 centers', 'Unlimited class bookings', 'QR check-in', 'Personal training x1', 'Nutrition guide'] },
    { id: `${centerId}-m`, name: `${centerName} — Monthly`, plan_type: 'single_center', center_id: centerId,
      duration_days: 30, price_inr: bp, is_featured: false,
      features: [`Access to ${centerName} only`, 'Locker access', 'Trainer support'] },
    { id: `${centerId}-q`, name: `${centerName} — Quarterly`, plan_type: 'single_center', center_id: centerId,
      duration_days: 90, price_inr: bp * 3 - 200, is_featured: false,
      features: [`Access to ${centerName} only`, 'Locker access', 'Group class included'] },
    { id: `${centerId}-a`, name: `${centerName} — Annual`, plan_type: 'single_center', center_id: centerId,
      duration_days: 365, price_inr: bp * 10, is_featured: false,
      features: [`Access to ${centerName} only`, 'Locker access', '2 months free', 'Personalized plan'] },
    { id: `${centerId}-d`, name: `${centerName} — Drop-In`, plan_type: 'single_center', center_id: centerId,
      duration_days: 1, price_inr: Math.round(bp / 10) + 49, is_featured: false,
      features: ['Single day access', 'All equipment access'] },
  ]
}

const CenterDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const { providerProfile, pricingPlans, batches, mediaFiles, reviews } = useProviderStore()

  const [center, setCenter] = useState<any>(null)
  const [schedules, setSchedules] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingSlot, setBookingSlot] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      setLoading(true)

      // Override if viewing active custom provider center
      if (providerProfile && id === providerProfile.id) {
        const usedCenter = {
          id: providerProfile.id,
          name: providerProfile.businessName,
          type: providerProfile.category,
          specialization: providerProfile.bio,
          address: providerProfile.fullAddress || providerProfile.area,
          area: providerProfile.area,
          rating: 4.9,
          total_reviews: reviews.length,
          image_url: providerProfile.profilePhoto || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
          opening_time: '06:00 AM',
          closing_time: '09:00 PM',
          amenities: providerProfile.subSpecializations || []
        }
        setCenter(usedCenter)
        setSchedules(batches.map(b => ({
          id: b.id,
          center_id: providerProfile.id,
          class_name: b.batchName,
          instructor_name: providerProfile.ownerName || 'Lead Coach',
          class_type: providerProfile.category,
          day_of_week: b.dayOfWeek,
          start_time: b.startTime,
          end_time: b.endTime,
          max_capacity: b.capacity,
          current_bookings: b.currentOccupancy || 0
        })))
        setPlans(pricingPlans.map(pl => ({
          id: pl.id,
          name: pl.label,
          plan_type: 'single_center',
          center_id: providerProfile.id,
          duration_days: pl.duration.includes('month') ? parseInt(pl.duration) * 30 : 30,
          price_inr: pl.price,
          is_featured: pl.isPopular,
          features: pl.description ? [pl.description] : ['Premium Trainer access', 'Flexible slot attendance']
        })))
        setLoading(false)
        return
      }

      const [{ data: c }, { data: s }, { data: p }] = await Promise.all([
        supabase.from('fitness_centers').select('*').eq('id', id).single(),
        supabase.from('class_schedules').select('*').eq('center_id', id).order('start_time'),
        supabase.from('subscription_plans').select('*').or(`center_id.eq.${id},plan_type.eq.all_access`).order('price_inr'),
      ])

      // Use Supabase data if available, otherwise fallback
      const fallbackCenter = FALLBACK_CENTERS.find(fc => fc.id === id)
      const usedCenter = c || fallbackCenter

      if (usedCenter) {
        setCenter(usedCenter)
        setSchedules(s && s.length > 0 ? s : generateFallbackSchedules(id, usedCenter.type))
        setPlans(p && p.length > 0 ? p : generateFallbackPlans(id, usedCenter.name, usedCenter.type, usedCenter.rating))
      }
      setLoading(false)
    }
    fetchData()
  }, [id, providerProfile])

  const daySchedules = schedules.filter(s => s.day_of_week === selectedDay)

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse max-w-7xl mx-auto px-4 py-16 space-y-8">
          <div className="h-80 bg-slate-200 rounded-3xl" />
          <div className="h-8 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
        </div>
      </MainLayout>
    )
  }

  if (!center) {
    return (
      <MainLayout>
        <div className="text-center py-32">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Center not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">Go Home</button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Hero */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={center.image_url}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' }}
          className="w-full h-full object-cover brightness-[0.55]"
          alt={center.name}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 w-fit text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${TYPE_COLORS[center.type] || 'bg-white/90 text-slate-900'}`}>
              {CATEGORY_LABELS[center.type] || center.type}
            </span>
            {center.rating >= 4.8 && (
              <span className="flex items-center gap-1 bg-amber-400/90 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                <Award className="h-3 w-3" /> Top Rated
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{center.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{center.address || center.area}, {center.area}</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-current text-amber-400" />{center.rating} ({center.total_reviews} reviews)</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{center.opening_time} – {center.closing_time}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Specializations */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {center.specialization?.split(',').map((s: string) => (
                <span key={s} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium">{s.trim()}</span>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {center.amenities?.map((a: string) => (
                <div key={a} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Location</h2>
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-64">
              <iframe
                title="map"
                width="100%" height="100%" style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent((center.address || center.area) + ' Jodhpur Rajasthan')}&output=embed`}
                allowFullScreen
              />
            </div>
          </div>

          {/* Class Schedule */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Class Schedule</h2>
            <div className="flex gap-2 flex-wrap mb-6">
              {DAYS.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedDay === d ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {daySchedules.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No classes scheduled for {selectedDay}</p>
              ) : daySchedules.map(s => (
                <div key={s.id} className="card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-2 rounded-xl text-center min-w-[70px]">
                      {s.start_time?.slice(0, 5)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{s.class_name}</p>
                      <p className="text-sm text-slate-500">{s.instructor_name} • {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{s.current_bookings}/{s.max_capacity}</span>
                    </div>
                    {user ? (
                      <button 
                        onClick={() => {
                          if (providerProfile && center.id === providerProfile.id) {
                            setShowEnquiry(true)
                          }
                        }}
                        className="btn-primary text-sm px-4 py-2" 
                        disabled={s.current_bookings >= s.max_capacity}
                      >
                        {s.current_bookings >= s.max_capacity ? 'Full' : 'Book'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (providerProfile && center.id === providerProfile.id) {
                            setShowEnquiry(true)
                          } else {
                            navigate('/login')
                          }
                        }} 
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Login to Book
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trainers Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Our Trainers</h2>
            <p className="text-slate-500 text-sm mb-6">Expert certified trainers to guide your fitness journey</p>

            {/* Personal Trainers */}
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">💎 Personal Trainers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {center && getTrainers(id!, center.type).filter(t => t.role === 'personal').map(t => (
                <div key={t.id} className="card p-5 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 mb-3">
                    <img src={t.photo} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' }} className="w-16 h-16 rounded-2xl object-cover" alt={t.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{t.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-amber-600"><Star className="h-3 w-3 fill-current" />{t.rating} • {t.sessions}+ sessions</div>
                      <p className="text-xs text-slate-500 mt-0.5">{t.experience} experience</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{t.specialization}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.certifications.slice(0, 2).map(c => (
                      <span key={c} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"><BadgeCheck className="h-3 w-3" />{c}</span>
                    ))}
                    {t.certifications.length > 2 && <span className="text-xs text-slate-400">+{t.certifications.length - 2} more</span>}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        if (providerProfile && center.id === providerProfile.id) {
                          setShowEnquiry(true)
                        } else {
                          setSelectedTrainer(t)
                          setBookingSuccess(false)
                        }
                      }} 
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Common Trainers */}
            <h3 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-4">🏋️ Floor / Common Trainers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {center && getTrainers(id!, center.type).filter(t => t.role === 'common').map(t => (
                <div key={t.id} className="card p-5">
                  <div className="flex gap-4 mb-3">
                    <img src={t.photo} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' }} className="w-14 h-14 rounded-xl object-cover" alt={t.name} />
                    <div>
                      <h4 className="font-bold text-slate-900">{t.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-amber-600"><Star className="h-3 w-3 fill-current" />{t.rating} • {t.sessions}+ sessions</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{t.specialization}</p>
                  <div className="flex flex-wrap gap-1">
                    {t.certifications.map(c => (
                      <span key={c} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md"><BadgeCheck className="h-3 w-3" />{c}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">FREE with membership</span>
                    <span className="text-xs text-slate-400">Available: {t.available.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Dumbbell className="h-5 w-5" /> Training Equipment</h2>
            <p className="text-slate-500 text-sm mb-6">All the tools you need for an effective workout</p>
            {(() => {
              const equipment = center ? getEquipment(center.type) : []
              const categories = [...new Set(equipment.map(e => e.category))]
              return categories.map(cat => (
                <div key={cat} className="mb-5">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">{cat}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {equipment.filter(e => e.category === cat).map(e => (
                      <div key={e.name} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                        <span className="text-lg">{e.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{e.name}</p>
                          <p className="text-xs text-slate-400">×{e.count}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Right: Subscription Plans */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Available Plans</h2>
          {plans.map(p => (
            <div key={p.id} className={`card p-6 ${p.is_featured ? 'ring-2 ring-primary' : ''}`}>
              {p.is_featured && (
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">⭐ Most Popular</div>
              )}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-slate-900 text-base leading-tight">{p.name}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                    {p.plan_type === 'all_access' ? 'All Centers' : `${p.duration_days === 1 ? 'Drop-in' : p.duration_days + ' days'}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">₹{p.price_inr.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <ul className="space-y-1.5 mb-4">
                {p.features?.slice(0, 3).map((f: string) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  if (providerProfile && center.id === providerProfile.id) {
                    setShowEnquiry(true)
                  } else {
                    navigate(`/checkout?plan=${p.id}`)
                  }
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${p.is_featured ? 'btn-primary' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                Subscribe Now
              </button>
            </div>
          ))}

          {/* Quick CTA */}
          <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="font-bold text-lg mb-2">Want all centers?</h3>
            <p className="text-slate-300 text-sm mb-4">Get unlimited access to every fitness center in Jodhpur with one membership.</p>
            <Link to="/pricing" className="btn-primary w-full py-3 text-center block font-bold">
              View All Plans →
            </Link>
          </div>
        </div>
      </div>

      {/* Trainer Booking Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTrainer(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Book Personal Session</h2>
              <button onClick={() => setSelectedTrainer(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="h-5 w-5" /></button>
            </div>

            {bookingSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-8 w-8 text-green-600" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                <p className="text-slate-500 mb-1">Session with <strong>{selectedTrainer.name}</strong></p>
                <p className="text-slate-500 mb-6">{bookingDate} • {bookingSlot}</p>
                <button onClick={() => setSelectedTrainer(null)} className="btn-primary px-8 py-3">Done</button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Trainer Info */}
                <div className="flex gap-4 items-center">
                  <img src={selectedTrainer.photo} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' }} className="w-20 h-20 rounded-2xl object-cover" alt={selectedTrainer.name} />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{selectedTrainer.name}</h3>
                    <div className="flex items-center gap-1 text-amber-600 text-sm"><Star className="h-3 w-3 fill-current" />{selectedTrainer.rating} • {selectedTrainer.experience}</div>
                    <p className="text-sm text-slate-500 mt-1">{selectedTrainer.specialization}</p>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTrainer.certifications.map(c => (
                      <span key={c} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1.5 rounded-lg"><BadgeCheck className="h-3 w-3" />{c}</span>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><Calendar className="h-4 w-4" /> Select Date</h4>
                  <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Select Time Slot</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedTrainer.available.map(slot => (
                      <button key={slot} type="button" onClick={() => setBookingSlot(slot)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${bookingSlot === slot ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >{slot}</button>
                    ))}
                  </div>
                </div>

                {/* Price + Book */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div><span className="text-xs text-slate-400 block">Session Fee</span><span className="text-2xl font-bold text-slate-900">₹{selectedTrainer.fee}</span></div>
                  <button onClick={() => { if (!bookingDate || !bookingSlot) { toast.error('Please select date and time'); return; } setBookingSuccess(true); toast.success('Session booked! 🎉') }}
                    className="btn-primary px-8 py-3 font-bold">Confirm Booking</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Enquiry Modal */}
      {showEnquiry && providerProfile && (
        <EnquiryModal 
          providerId={providerProfile.id}
          businessName={providerProfile.businessName}
          onClose={() => setShowEnquiry(false)}
        />
      )}
    </MainLayout>
  )
}

export default CenterDetail
