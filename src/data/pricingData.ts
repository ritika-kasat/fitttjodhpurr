export interface Plan {
  id: string;
  name: string;
  plan_type: 'all_access' | 'single_center';
  center_id: string | null;
  duration_days: number;
  price_inr: number;
  is_featured: boolean;
  features: string[];
}

export const FALLBACK_CENTERS = [
  { id: '1', name: 'Anytime Fitness', area: 'Ratanada', type: 'gym', rating: 4.8 },
  { id: '2', name: 'Bazooka Fitness', area: 'Sardarpura', type: 'gym', rating: 4.6 },
  { id: '3', name: 'D Fitness Gym', area: 'Baldev Nagar', type: 'gym', rating: 4.9 },
  { id: '4', name: 'Hanuman Fitness Club', area: 'Jhalamand Circle', type: 'gym', rating: 4.7 },
  { id: '5', name: 'Bossfit New Level Of Fitness', area: 'Shankar Nagar', type: 'gym', rating: 4.8 },
  { id: '6', name: 'Equinox Fitness', area: 'Paota', type: 'gym', rating: 4.8 },
  { id: '7', name: 'Metalix Gym', area: 'Paota', type: 'gym', rating: 4.7 },
  { id: '8', name: 'Trident Fitness', area: 'Rai Ka Bagh', type: 'gym', rating: 4.8 },
  { id: '9', name: 'Yoga Guru Karan Singh', area: 'Jodhpur', type: 'yoga', rating: 4.9 },
  { id: '10', name: 'Sai Yogasthali Sansthan', area: 'Various Locations', type: 'yoga', rating: 4.8 },
  { id: '11', name: "Priyanka's Yoga Studio", area: 'Ratanada', type: 'yoga', rating: 4.7 },
  { id: '12', name: "Menka's Yogvatika", area: 'Paota', type: 'yoga', rating: 5.0 },
  { id: '13', name: 'Satva Yoga Studio', area: 'Panchsheel Colony', type: 'yoga', rating: 4.9 },
  { id: '14', name: 'Om Yoga Ashram', area: 'Old City', type: 'yoga', rating: 4.8 },
  { id: '15', name: 'Ravinder Kumar', area: 'Chopasni Road', type: 'yoga', rating: 4.9 },
  { id: '16', name: 'Medical College Swimming Pool', area: 'Shastri Nagar', type: 'swimming', rating: 4.7 },
  { id: '17', name: 'Jodhpur Sports Club', area: 'Pal Road', type: 'swimming', rating: 4.6 },
  { id: '18', name: 'Aqua Arena Club', area: 'AIIMS Road', type: 'swimming', rating: 4.8 },
  { id: '19', name: 'Scorpion Sports Academy', area: 'Paota', type: 'swimming', rating: 4.7 },
  { id: '20', name: 'Sukhani Farms', area: 'Chokhan', type: 'swimming', rating: 4.4 },
  { id: '21', name: "Sunil's Dance and Zumba Classes", area: 'Shastri Nagar', type: 'zumba', rating: 4.9 },
  { id: '22', name: 'SK Dance Fitness Studio', area: 'Shastri Nagar', type: 'dance', rating: 4.8 },
  { id: '23', name: 'Musical Beats Dance Studio', area: 'Pal Road', type: 'dance', rating: 4.7 },
  { id: '24', name: 'Inspire Dance Studio', area: 'Paota', type: 'zumba', rating: 4.6 },
  { id: '25', name: 'Raja Jolly Dance Academy', area: 'Sardarpura', type: 'dance', rating: 4.8 },
  { id: '26', name: 'Friends Dance Academy', area: 'Ratanada', type: 'dance', rating: 4.7 },
]

export const BASE_PRICES: Record<string, number> = {
  crossfit: 2499, mma: 2199, yoga: 1499, zumba: 1299,
  pilates: 1999, swimming: 1799, dance: 1299, cycling: 1499, meditation: 999, gym: 1499,
}

export function generatePlans(): Plan[] {
  const allAccess: Plan[] = [
    { id: 'all-m', name: 'FitJodhpur All-Access Monthly', plan_type: 'all_access', center_id: null,
      duration_days: 30, price_inr: 1999, is_featured: false,
      features: ['Access to all 12 centers', 'Unlimited class bookings', 'QR check-in', 'Free guest pass (1/month)'] },
    { id: 'all-q', name: 'FitJodhpur All-Access Quarterly', plan_type: 'all_access', center_id: null,
      duration_days: 90, price_inr: 4999, is_featured: true,
      features: ['Access to all 12 centers', 'Unlimited class bookings', 'QR check-in', 'Personal training x1', 'Nutrition guide'] },
    { id: 'all-a', name: 'FitJodhpur All-Access Annual', plan_type: 'all_access', center_id: null,
      duration_days: 365, price_inr: 14999, is_featured: false,
      features: ['Access to all 12 centers', 'Unlimited class bookings', 'QR check-in', 'Personal training x4', 'Premium health kit', 'Priority booking'] },
  ]

  const singleCenter: Plan[] = FALLBACK_CENTERS.flatMap(c => {
    let bp = BASE_PRICES[c.type] || 1499
    
    // Adjust price based on rating (4.5 rating = base price, 5.0 = premium, <4.5 = discount)
    const ratingMultiplier = (c.rating / 4.5);
    // Add some uniqueness based on center ID
    const uniqueFactor = (parseInt(c.id) * 10);
    bp = Math.round(bp * ratingMultiplier) + uniqueFactor;
    
    // Round to nearest 99 (e.g., 1542 -> 1499 or 1599)
    bp = Math.floor(bp / 100) * 100 + 99;

    return [
      { id: `${c.id}-m`, name: `${c.name} — Monthly`, plan_type: 'single_center', center_id: c.id,
        duration_days: 30, price_inr: bp, is_featured: false,
        features: [`Access to ${c.name} only`, 'Locker access', 'Trainer support'] },
      { id: `${c.id}-q`, name: `${c.name} — Quarterly`, plan_type: 'single_center', center_id: c.id,
        duration_days: 90, price_inr: bp * 3 - 200, is_featured: false,
        features: [`Access to ${c.name} only`, 'Locker access', 'Group class included'] },
      { id: `${c.id}-a`, name: `${c.name} — Annual`, plan_type: 'single_center', center_id: c.id,
        duration_days: 365, price_inr: bp * 10, is_featured: false,
        features: [`Access to ${c.name} only`, 'Locker access', '2 months free', 'Personalized plan'] },
      { id: `${c.id}-d`, name: `${c.name} — Drop-In`, plan_type: 'single_center', center_id: c.id,
        duration_days: 1, price_inr: Math.round(bp / 10) + 49, is_featured: false, // Adjusted drop-in price
        features: ['Single day access', 'All equipment access'] },
    ]
  })

  return [...allAccess, ...singleCenter]
}
