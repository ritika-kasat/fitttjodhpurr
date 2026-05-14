import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, MapPin, Star, Award, X, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['All', 'gym', 'yoga', 'crossfit', 'mma', 'zumba', 'pilates', 'swimming', 'dance', 'cycling', 'meditation']
const CATEGORY_LABELS: Record<string, string> = {
  All: 'All Types', gym: 'Gym', yoga: 'Yoga', crossfit: 'CrossFit',
  mma: 'MMA', zumba: 'Zumba', pilates: 'Pilates', swimming: 'Swimming',
  dance: 'Dance', cycling: 'Cycling', meditation: 'Meditation',
}
const AREAS = ['All', 'Ratanada', 'Paota', 'Sardarpura', 'Pal', 'Mandore', 'City', 'Rai Ka Bagh']

const TYPE_COLORS: Record<string, string> = {
  gym: 'bg-blue-100 text-blue-700',
  yoga: 'bg-green-100 text-green-700',
  crossfit: 'bg-red-100 text-red-700',
  mma: 'bg-purple-100 text-purple-700',
  pilates: 'bg-pink-100 text-pink-700',
  zumba: 'bg-orange-100 text-orange-700',
  swimming: 'bg-cyan-100 text-cyan-700',
  dance: 'bg-violet-100 text-violet-700',
  cycling: 'bg-amber-100 text-amber-700',
  meditation: 'bg-teal-100 text-teal-700',
}

interface Center {
  id: string
  name: string
  type: string
  area: string
  rating: number
  total_reviews: number
  image_url: string
  specialization: string
  amenities: string[]
  opening_time: string
  closing_time: string
}

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="h-64 bg-slate-200" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
      <div className="h-4 bg-slate-100 rounded w-full" />
      <div className="h-10 bg-slate-200 rounded-xl mt-4" />
    </div>
  </div>
)

const FALLBACK_CENTERS: Center[] = [
  // Gyms & Fitness Centers
  { id: '1', name: 'Anytime Fitness', type: 'gym', specialization: 'International-standard equipment, Personalized training, Group activities', area: 'Ratanada', rating: 4.8, total_reviews: 320, amenities: ["AC", "24 Hrs", "Parking", "Locker"], image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', opening_time: '12:00 AM', closing_time: '11:59 PM' },
  { id: '2', name: 'Bazooka Fitness', type: 'gym', specialization: 'Modern equipment, Personal training', area: 'Sardarpura', rating: 4.6, total_reviews: 180, amenities: ["AC", "Personal Training", "Locker"], image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '10:00 PM' },
  { id: '3', name: 'D Fitness Gym', type: 'gym', specialization: 'Personal training', area: 'Baldev Nagar', rating: 4.9, total_reviews: 210, amenities: ["AC", "Personal Training", "Parking"], image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '09:30 PM' },
  { id: '4', name: 'Hanuman Fitness Club', type: 'gym', specialization: 'Bodybuilding, Bench Press, Strength Training, Custom diet plans', area: 'Jhalamand Circle', rating: 4.7, total_reviews: 500, amenities: ["Strength Equipment", "Diet Counseling", "Parking"], image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800', opening_time: '05:00 AM', closing_time: '10:00 PM' },
  { id: '5', name: 'Bossfit New Level Of Fitness', type: 'gym', specialization: 'Functional training, Personalized fitness', area: 'Shankar Nagar', rating: 4.8, total_reviews: 150, amenities: ["AC", "Functional Area", "Locker"], image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '09:00 PM' },
  { id: '6', name: 'Equinox Fitness', type: 'gym', specialization: 'In-depth muscle anatomy, Personal training', area: 'Paota', rating: 4.8, total_reviews: 450, amenities: ["AC", "Parking", "Locker", "Shower"], image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '10:00 PM' },
  { id: '7', name: 'Metalix Gym', type: 'gym', specialization: 'Functional fitness, Traditional training', area: 'Paota', rating: 4.7, total_reviews: 310, amenities: ["AC", "Parking", "Supplement Store"], image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', opening_time: '05:00 AM', closing_time: '10:00 PM' },
  { id: '8', name: 'Trident Fitness', type: 'gym', specialization: 'Strength, Cardio, Group classes', area: 'Rai Ka Bagh', rating: 4.8, total_reviews: 120, amenities: ["Cardio Section", "Group Classes", "Lockers"], image_url: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '09:00 PM' },

  // Yoga Studios & Centers
  { id: '9', name: 'Yoga Guru Karan Singh', type: 'yoga', specialization: 'Traditional yoga, Pilates, Personalized training', area: 'Jodhpur', rating: 4.9, total_reviews: 210, amenities: ["Meditation Hall", "Yoga Props", "Parking"], image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },
  { id: '10', name: 'Sai Yogasthali Sansthan', type: 'yoga', specialization: 'Therapeutic Yoga, Naturopathy, Teacher Training', area: 'Various Locations', rating: 4.8, total_reviews: 320, amenities: ["Naturopathy", "Mats Provided", "Quiet Zone"], image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '07:30 PM' },
  { id: '11', name: "Priyanka's Yoga Studio", type: 'yoga', specialization: "Yoga & Mindfulness, Meditation, Children's yoga", area: 'Ratanada', rating: 4.7, total_reviews: 140, amenities: ["AC", "Kids Classes", "Mats Provided"], image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },
  { id: '12', name: "Menka's Yogvatika", type: 'yoga', specialization: 'Therapeutic yoga, Beginner classes', area: 'Paota', rating: 5.0, total_reviews: 180, amenities: ["Therapy Focus", "Parking", "Quiet Zone"], image_url: 'https://images.unsplash.com/photo-1552286450-5a6c40b165ce?auto=format&fit=crop&q=80&w=800', opening_time: '06:30 AM', closing_time: '07:30 PM' },
  { id: '13', name: 'Satva Yoga Studio', type: 'yoga', specialization: 'Holistic yoga practice', area: 'Panchsheel Colony', rating: 4.9, total_reviews: 95, amenities: ["Holistic Approach", "Mats Provided", "AC"], image_url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },
  { id: '14', name: 'Om Yoga Ashram', type: 'yoga', specialization: 'Yoga, Reiki, Meditation, Sound Healing', area: 'Old City', rating: 4.8, total_reviews: 200, amenities: ["Sound Healing", "Reiki", "Meditation Hall"], image_url: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&q=80&w=800', opening_time: '05:00 AM', closing_time: '08:00 PM' },
  { id: '15', name: 'Ravinder Kumar', type: 'yoga', specialization: 'Ayurvedic doctor, Certified Yoga Teacher', area: 'Chopasni Road', rating: 4.9, total_reviews: 110, amenities: ["Ayurvedic Consultation", "Parking"], image_url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },

  // Swimming Pools & Coaching
  { id: '16', name: 'Medical College Swimming Pool', type: 'swimming', specialization: 'Olympic-sized pool, Training for all age groups', area: 'Shastri Nagar', rating: 4.7, total_reviews: 400, amenities: ["Olympic Pool", "Coaching", "Changing Rooms"], image_url: 'https://images.unsplash.com/photo-1576013462273-d130a112245b?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '09:00 PM' },
  { id: '17', name: 'Jodhpur Sports Club', type: 'swimming', specialization: '60x30 ft main pool, Kids pool, Women batches', area: 'Pal Road', rating: 4.6, total_reviews: 250, amenities: ["Kids Pool", "Women Batches", "Showers"], image_url: 'https://images.unsplash.com/photo-1530549387725-0b0c67da4dd2?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:30 PM' },
  { id: '18', name: 'Aqua Arena Club', type: 'swimming', specialization: 'Specialized swimming training for children', area: 'AIIMS Road', rating: 4.8, total_reviews: 130, amenities: ["Kids Training", "Lockers", "Cafeteria"], image_url: 'https://images.unsplash.com/photo-1600965962102-9d260a71890d?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '09:00 PM' },
  { id: '19', name: 'Scorpion Sports Academy', type: 'swimming', specialization: 'Professional coaching for non-swimmers', area: 'Paota', rating: 4.7, total_reviews: 180, amenities: ["Professional Coaching", "Showers"], image_url: 'https://images.unsplash.com/photo-1519315901367-f34f828a2a16?auto=format&fit=crop&q=80&w=800', opening_time: '05:30 AM', closing_time: '08:00 PM' },
  { id: '20', name: 'Sukhani Farms', type: 'swimming', specialization: 'Swimming lessons', area: 'Chokhan', rating: 4.4, total_reviews: 90, amenities: ["Outdoor Pool", "Parking", "Relaxation Area"], image_url: 'https://images.unsplash.com/photo-1519315901367-f34f828a2a16?auto=format&fit=crop&q=80&w=800', opening_time: '06:00 AM', closing_time: '08:00 PM' },

  // Dance & Zumba Centres
  { id: '21', name: "Sunil's Dance and Zumba Classes", type: 'zumba', specialization: 'Zumba, Dance Fitness, Hula Hoop, Kids fitness', area: 'Shastri Nagar', rating: 4.9, total_reviews: 310, amenities: ["AC", "Wooden Floor", "Sound System"], image_url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=800', opening_time: '07:00 AM', closing_time: '09:00 PM' },
  { id: '22', name: 'SK Dance Fitness Studio', type: 'dance', specialization: 'Zumba and dance fitness', area: 'Shastri Nagar', rating: 4.8, total_reviews: 150, amenities: ["Mirrors", "AC", "Dance Floor"], image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', opening_time: '06:30 AM', closing_time: '08:30 PM' },
  { id: '23', name: 'Musical Beats Dance Studio', type: 'dance', specialization: 'Zumba and various dance forms', area: 'Pal Road', rating: 4.7, total_reviews: 210, amenities: ["AC", "Sound System", "Parking"], image_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800', opening_time: '08:00 AM', closing_time: '08:00 PM' },
  { id: '24', name: 'Inspire Dance Studio', type: 'zumba', specialization: 'Group Zumba and aerobics sessions', area: 'Paota', rating: 4.6, total_reviews: 120, amenities: ["Group Sessions", "AC", "Changing Room"], image_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800', opening_time: '07:00 AM', closing_time: '09:00 PM' },
  { id: '25', name: 'Raja Jolly Dance Academy', type: 'dance', specialization: 'Energetic Zumba and dance workshops', area: 'Sardarpura', rating: 4.8, total_reviews: 190, amenities: ["Workshops", "Sound System", "Dance Floor"], image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', opening_time: '09:00 AM', closing_time: '09:00 PM' },
  { id: '26', name: 'Friends Dance Academy', type: 'dance', specialization: 'Dance classes', area: 'Ratanada', rating: 4.7, total_reviews: 110, amenities: ["AC", "Mirrors", "Sound System"], image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', opening_time: '08:00 AM', closing_time: '08:00 PM' }
];

const Home = () => {
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedArea, setSelectedArea] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('fitness_centers')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })

      if (error) {
        console.error('Supabase fetch error:', error.message, error)
      }
      
      if (data && data.length > 0) {
        setCenters(data)
      } else {
        // Fallback to local data if database is empty
        setCenters(FALLBACK_CENTERS)
      }
      setLoading(false)
    }
    fetchCenters()
  }, [])

  // Live filtering in JS
  const filtered = useMemo(() => {
    return centers.filter(c => {
      const q = searchQuery.toLowerCase()
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.specialization?.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
      const matchType = selectedCategory === 'All' || c.type === selectedCategory
      const matchArea = selectedArea === 'All' || c.area === selectedArea
      const matchRating = c.rating >= minRating
      return matchSearch && matchType && matchArea && matchRating
    })
  }, [centers, searchQuery, selectedCategory, selectedArea, minRating])

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedArea !== 'All' || minRating > 0

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedArea('All')
    setMinRating(0)
  }

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1920"
            className="w-full h-full object-cover brightness-[0.35]"
            alt="Gym hero"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Elevate Your Fitness in the <span style={{ color: 'var(--color-primary)' }}>Blue City</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Access Jodhpur's best gyms, yoga studios, CrossFit boxes & MMA centers with one FitPass membership.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-3">Explore All-Access</button>
            <button
              onClick={() => document.getElementById('centers-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
            >
              View All Centers
            </button>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, type, area, specialization..."
                className="input-field pl-12 h-14 text-base"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
              <select
                className="input-field pl-12 h-14 appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            {/* Area Select */}
            <div className="relative min-w-[150px]">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
              <select
                className="input-field pl-12 h-14 appearance-none cursor-pointer"
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
              >
                {AREAS.map(area => (
                  <option key={area} value={area}>{area === 'All' ? 'All Areas' : area}</option>
                ))}
              </select>
            </div>

            {/* Advanced Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 h-14 rounded-xl font-medium border transition-all ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="hidden md:inline">More</span>
            </button>
          </div>

          {/* Advanced Filters (Rating) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Min Rating</label>
                <div className="flex gap-2">
                  {[0, 4.0, 4.3, 4.5, 4.7].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${minRating === r ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Centers Grid */}
      <section id="centers-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Results header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {hasActiveFilters ? 'Search Results' : 'All Fitness Centers'}
            </h2>
            <p className="text-slate-500 mt-1">
              {loading ? 'Loading...' : `${filtered.length} center${filtered.length !== 1 ? 's' : ''} found in Jodhpur`}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            {searchQuery && (
              <span className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-full">
                Type: {CATEGORY_LABELS[selectedCategory]}
                <button onClick={() => setSelectedCategory('All')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {selectedArea !== 'All' && (
              <span className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-full">
                Area: {selectedArea}
                <button onClick={() => setSelectedArea('All')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {minRating > 0 && (
              <span className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-full">
                Rating: {minRating}+
                <button onClick={() => setMinRating(0)}><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No centers found</h3>
            <p className="text-slate-500 mb-8">Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="btn-primary px-8 py-3">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(center => (
              <div key={center.id} className="card group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={center.image_url}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={center.name}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${TYPE_COLORS[center.type] || 'bg-white/90 text-slate-900'}`}>
                      {CATEGORY_LABELS[center.type] || center.type}
                    </span>
                  </div>
                  {center.rating >= 4.8 && (
                    <div className="absolute top-4 right-4">
                      <div className="p-2 rounded-full text-white shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <Award className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight pr-2">
                      {center.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{center.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                    <MapPin className="h-3 w-3" />
                    <span>{center.area}</span>
                    <span className="mx-1">•</span>
                    <span>{center.total_reviews} reviews</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{center.specialization}</p>
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {center.amenities?.slice(0, 3).map(a => (
                      <span key={a} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">{a}</span>
                    ))}
                    {center.amenities?.length > 3 && (
                      <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-md">+{center.amenities.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 block uppercase font-bold tracking-widest">Hours</span>
                      <span className="text-sm font-bold text-slate-700">{center.opening_time} – {center.closing_time}</span>
                    </div>
                    <Link
                      to={`/center/${center.id}`}
                      className="btn-primary text-sm px-5 py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All-Access Banner */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-white max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">One Membership.<br />Every Gym in Jodhpur.</h2>
            <p className="text-xl mb-8 opacity-80">
              With FitJodhpur All-Access, workout anywhere. Gym today, Yoga tomorrow, MMA the next day.
            </p>
            <div className="flex flex-wrap gap-4">
              {['10+ Premium Centers', 'Unlimited Classes', 'QR Check-in'].map(f => (
                <div key={f} className="bg-white/20 px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm">
                  <Star className="h-4 w-4 fill-current" />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm shrink-0">
            <div className="text-center mb-6">
              <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest" style={{ color: 'var(--color-primary)', backgroundColor: 'rgb(232 100 44 / 0.1)' }}>Most Popular</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">FitPass All-Access</h3>
              <p className="text-slate-500 mt-1">Unlimited access to all centers</p>
            </div>
            <div className="text-center mb-8">
              <span className="text-4xl font-bold text-slate-900">₹1,499</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['All 10+ Centers included', 'Unlimited bookings', 'QR Check-in pass', 'Cancel anytime'].map(feat => (
                <li key={feat} className="flex items-center gap-3 text-slate-700">
                  <div className="bg-green-100 text-green-600 rounded-full p-1">
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary w-full py-4 text-lg">Get All-Access Now</button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

export default Home
