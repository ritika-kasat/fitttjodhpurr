// Trainers data per center type
export interface Trainer {
  id: string; name: string; role: 'personal' | 'common'; photo: string;
  specialization: string; experience: string; certifications: string[];
  rating: number; sessions: number; fee: number; available: string[];
}

export interface Equipment {
  name: string; category: string; count: number; icon: string;
}

const TRAINER_PHOTOS = [
  'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=400',
]

export function getTrainers(centerId: string, centerType: string): Trainer[] {
  const trainers: Record<string, Trainer[]> = {
    gym: [
      { id: `${centerId}-t1`, name: 'Rahul Sharma', role: 'personal', photo: TRAINER_PHOTOS[0],
        specialization: 'Body Transformation, Weight Loss, Muscle Building',
        experience: '8 years', certifications: ['ACE Certified Personal Trainer', 'ISSA Nutrition Specialist', 'CPR/AED Certified'],
        rating: 4.9, sessions: 1200, fee: 800, available: ['Morning', 'Evening'] },
      { id: `${centerId}-t2`, name: 'Neha Kapoor', role: 'personal', photo: TRAINER_PHOTOS[1],
        specialization: 'Functional Training, Women Fitness, HIIT',
        experience: '5 years', certifications: ['NASM Certified', 'Crossfit Level 1', 'Pre/Post Natal Fitness'],
        rating: 4.8, sessions: 850, fee: 700, available: ['Morning', 'Afternoon'] },
      { id: `${centerId}-t3`, name: 'Vikram Rathore', role: 'common', photo: TRAINER_PHOTOS[2],
        specialization: 'Powerlifting, Strength Training, Calisthenics',
        experience: '6 years', certifications: ['NSCA-CSCS', 'First Aid Certified'],
        rating: 4.6, sessions: 2000, fee: 0, available: ['Morning', 'Evening'] },
      { id: `${centerId}-t4`, name: 'Anjali Singh', role: 'common', photo: TRAINER_PHOTOS[3],
        specialization: 'Cardio, Group Training, Flexibility',
        experience: '4 years', certifications: ['ACE Group Fitness Instructor', 'Zumba Licensed'],
        rating: 4.5, sessions: 1500, fee: 0, available: ['Afternoon', 'Evening'] },
    ],
    yoga: [
      { id: `${centerId}-t1`, name: 'Rishi Gupta', role: 'personal', photo: TRAINER_PHOTOS[0],
        specialization: 'Hatha Yoga, Ashtanga, Therapeutic Yoga',
        experience: '12 years', certifications: ['RYT-500 Yoga Alliance', 'Yoga Therapy Certification', 'Ayurveda Diploma'],
        rating: 4.9, sessions: 3000, fee: 600, available: ['Morning', 'Evening'] },
      { id: `${centerId}-t2`, name: 'Priya Verma', role: 'personal', photo: TRAINER_PHOTOS[1],
        specialization: 'Power Yoga, Prenatal Yoga, Meditation',
        experience: '7 years', certifications: ['RYT-200', 'Prenatal Yoga Certified', 'Mindfulness Coach'],
        rating: 4.8, sessions: 1800, fee: 500, available: ['Morning', 'Afternoon'] },
      { id: `${centerId}-t3`, name: 'Om Prakash', role: 'common', photo: TRAINER_PHOTOS[2],
        specialization: 'Pranayama, Classical Yoga, Flexibility',
        experience: '10 years', certifications: ['Government Certified Yoga Instructor'],
        rating: 4.7, sessions: 4000, fee: 0, available: ['Morning'] },
    ],
    crossfit: [
      { id: `${centerId}-t1`, name: 'Deepak Joshi', role: 'personal', photo: TRAINER_PHOTOS[0],
        specialization: 'Olympic Lifting, WOD Programming, Competition Prep',
        experience: '6 years', certifications: ['CrossFit Level 2 Trainer', 'USAW Sports Performance', 'CPR Certified'],
        rating: 4.9, sessions: 950, fee: 900, available: ['Morning', 'Evening'] },
      { id: `${centerId}-t2`, name: 'Sita Raman', role: 'common', photo: TRAINER_PHOTOS[1],
        specialization: 'Functional Fitness, Endurance, Mobility',
        experience: '4 years', certifications: ['CrossFit Level 1', 'Kettlebell Certified'],
        rating: 4.6, sessions: 1100, fee: 0, available: ['Morning', 'Afternoon', 'Evening'] },
    ],
    mma: [
      { id: `${centerId}-t1`, name: 'Sanjay Rawat', role: 'personal', photo: TRAINER_PHOTOS[0],
        specialization: 'Kickboxing, Muay Thai, Self Defense',
        experience: '10 years', certifications: ['Black Belt 3rd Dan', 'National MMA Champion 2019', 'Sports First Aid'],
        rating: 4.9, sessions: 2200, fee: 1000, available: ['Morning', 'Evening'] },
      { id: `${centerId}-t2`, name: 'Aakash Desai', role: 'common', photo: TRAINER_PHOTOS[2],
        specialization: 'Boxing, BJJ Fundamentals, Conditioning',
        experience: '5 years', certifications: ['BJJ Purple Belt', 'Boxing Coach Certified'],
        rating: 4.7, sessions: 1400, fee: 0, available: ['Afternoon', 'Evening'] },
    ],
    zumba: [
      { id: `${centerId}-t1`, name: 'Priya Verma', role: 'personal', photo: TRAINER_PHOTOS[1],
        specialization: 'Zumba, Dance Fitness, Aerobics Choreography',
        experience: '6 years', certifications: ['Licensed Zumba Instructor', 'AFAA Group Fitness', 'Dance Therapy'],
        rating: 4.8, sessions: 1600, fee: 500, available: ['Morning', 'Evening'] },
      { id: `${centerId}-t2`, name: 'Kavita Nair', role: 'common', photo: TRAINER_PHOTOS[3],
        specialization: 'Bollywood Dance, Step Aerobics, Cardio Dance',
        experience: '4 years', certifications: ['Zumba B1 Licensed', 'Aerobics Instructor'],
        rating: 4.5, sessions: 900, fee: 0, available: ['Morning', 'Afternoon', 'Evening'] },
    ],
  }
  // Default fallback
  return trainers[centerType] || trainers['gym']
}

export function getEquipment(centerType: string): Equipment[] {
  const equip: Record<string, Equipment[]> = {
    gym: [
      { name: 'Treadmill', category: 'Cardio', count: 8, icon: '🏃' },
      { name: 'Elliptical Machine', category: 'Cardio', count: 4, icon: '🔄' },
      { name: 'Stationary Bike', category: 'Cardio', count: 6, icon: '🚴' },
      { name: 'Flat Bench Press', category: 'Strength', count: 4, icon: '🏋️' },
      { name: 'Incline Bench Press', category: 'Strength', count: 2, icon: '🏋️' },
      { name: 'Smith Machine', category: 'Strength', count: 2, icon: '⚙️' },
      { name: 'Cable Crossover', category: 'Strength', count: 2, icon: '🔗' },
      { name: 'Dumbbell Set (2-50kg)', category: 'Free Weights', count: 1, icon: '💪' },
      { name: 'Barbell & Plates', category: 'Free Weights', count: 6, icon: '🔩' },
      { name: 'Kettlebells', category: 'Free Weights', count: 10, icon: '🔔' },
      { name: 'Leg Press Machine', category: 'Machines', count: 2, icon: '🦵' },
      { name: 'Lat Pulldown', category: 'Machines', count: 2, icon: '💪' },
      { name: 'Rowing Machine', category: 'Cardio', count: 3, icon: '🚣' },
      { name: 'Pull-up Bar Station', category: 'Bodyweight', count: 3, icon: '🤸' },
      { name: 'Battle Ropes', category: 'Functional', count: 2, icon: '🪢' },
      { name: 'Foam Rollers', category: 'Recovery', count: 8, icon: '🧘' },
    ],
    yoga: [
      { name: 'Yoga Mats (Premium)', category: 'Essential', count: 30, icon: '🧘' },
      { name: 'Yoga Blocks', category: 'Props', count: 40, icon: '🧱' },
      { name: 'Yoga Straps', category: 'Props', count: 25, icon: '🪢' },
      { name: 'Bolsters', category: 'Props', count: 15, icon: '🛋️' },
      { name: 'Meditation Cushions', category: 'Meditation', count: 20, icon: '🪷' },
      { name: 'Yoga Wheels', category: 'Props', count: 10, icon: '🔄' },
      { name: 'Resistance Bands', category: 'Strength', count: 15, icon: '💪' },
      { name: 'Aerial Yoga Hammocks', category: 'Aerial', count: 8, icon: '🎪' },
    ],
    crossfit: [
      { name: 'Olympic Barbells', category: 'Lifting', count: 10, icon: '🏋️' },
      { name: 'Bumper Plate Sets', category: 'Lifting', count: 8, icon: '🔩' },
      { name: 'Pull-up Rigs', category: 'Bodyweight', count: 4, icon: '🤸' },
      { name: 'Rowing Machines', category: 'Cardio', count: 6, icon: '🚣' },
      { name: 'Assault Bikes', category: 'Cardio', count: 4, icon: '🚴' },
      { name: 'Kettlebells', category: 'Functional', count: 20, icon: '🔔' },
      { name: 'Wall Balls', category: 'Functional', count: 15, icon: '⚽' },
      { name: 'Plyo Boxes', category: 'Functional', count: 8, icon: '📦' },
      { name: 'Gymnastics Rings', category: 'Bodyweight', count: 6, icon: '⭕' },
      { name: 'Battle Ropes', category: 'Functional', count: 4, icon: '🪢' },
    ],
    mma: [
      { name: 'Boxing Ring', category: 'Ring', count: 1, icon: '🥊' },
      { name: 'Heavy Punching Bags', category: 'Striking', count: 8, icon: '🥊' },
      { name: 'Speed Bags', category: 'Striking', count: 4, icon: '💨' },
      { name: 'MMA Gloves', category: 'Gear', count: 20, icon: '🧤' },
      { name: 'Shin Guards', category: 'Gear', count: 15, icon: '🛡️' },
      { name: 'Grappling Mats', category: 'Ground', count: 1, icon: '🤼' },
      { name: 'Focus Mitts', category: 'Training', count: 10, icon: '🎯' },
      { name: 'Skipping Ropes', category: 'Cardio', count: 15, icon: '🪢' },
    ],
    zumba: [
      { name: 'Professional Sound System', category: 'Audio', count: 1, icon: '🔊' },
      { name: 'Dance Floor (Sprung)', category: 'Floor', count: 1, icon: '💃' },
      { name: 'Wall Mirrors', category: 'Studio', count: 1, icon: '🪞' },
      { name: 'Toning Sticks', category: 'Equipment', count: 25, icon: '🥢' },
      { name: 'Step Platforms', category: 'Equipment', count: 20, icon: '📦' },
      { name: 'Resistance Bands', category: 'Equipment', count: 20, icon: '💪' },
    ],
    swimming: [
      { name: 'Olympic Pool (25m)', category: 'Pool', count: 1, icon: '🏊' },
      { name: 'Swimming Lanes', category: 'Pool', count: 6, icon: '🏊' },
      { name: 'Kickboards', category: 'Training', count: 15, icon: '🏄' },
      { name: 'Pull Buoys', category: 'Training', count: 12, icon: '🔵' },
      { name: 'Swim Fins', category: 'Gear', count: 10, icon: '🐠' },
      { name: 'Diving Blocks', category: 'Facility', count: 4, icon: '🏊' },
    ],
    pilates: [
      { name: 'Reformer Machines', category: 'Machines', count: 8, icon: '🔧' },
      { name: 'Cadillac/Trapeze', category: 'Machines', count: 2, icon: '🎪' },
      { name: 'Pilates Mats', category: 'Essential', count: 20, icon: '🧘' },
      { name: 'Magic Circle', category: 'Props', count: 15, icon: '⭕' },
      { name: 'Pilates Balls', category: 'Props', count: 20, icon: '⚽' },
      { name: 'Resistance Bands', category: 'Props', count: 15, icon: '💪' },
    ],
    dance: [
      { name: 'Sprung Dance Floor', category: 'Studio', count: 1, icon: '💃' },
      { name: 'Full Wall Mirrors', category: 'Studio', count: 1, icon: '🪞' },
      { name: 'Professional Sound System', category: 'Audio', count: 1, icon: '🔊' },
      { name: 'Ballet Barres', category: 'Equipment', count: 4, icon: '🩰' },
      { name: 'Wireless Microphones', category: 'Audio', count: 3, icon: '🎤' },
    ],
    cycling: [
      { name: 'Spin Bikes (Peloton)', category: 'Bikes', count: 20, icon: '🚴' },
      { name: 'Heart Rate Monitors', category: 'Tech', count: 20, icon: '❤️' },
      { name: 'Performance Screens', category: 'Tech', count: 20, icon: '📊' },
      { name: 'Sound System', category: 'Audio', count: 1, icon: '🔊' },
      { name: 'Cycling Shoes', category: 'Gear', count: 15, icon: '👟' },
    ],
    meditation: [
      { name: 'Meditation Cushions', category: 'Seating', count: 25, icon: '🪷' },
      { name: 'Singing Bowls', category: 'Sound', count: 5, icon: '🔔' },
      { name: 'Aromatherapy Diffusers', category: 'Ambience', count: 4, icon: '🌿' },
      { name: 'Eye Pillows', category: 'Relaxation', count: 20, icon: '😌' },
      { name: 'Blankets', category: 'Comfort', count: 20, icon: '🛋️' },
    ],
  }
  return equip[centerType] || equip['gym']
}
