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
  { id: '1', name: 'Equinox Fitness', area: 'Ratanada', type: 'gym' },
  { id: '2', name: 'Fitbox Fitness Studio', area: 'Paota', type: 'gym' },
  { id: '3', name: 'Metalix Gym', area: 'Sardarpura', type: 'gym' },
  { id: '4', name: 'CrossFit Fitness Center', area: 'Pal', type: 'crossfit' },
  { id: '5', name: 'Sky Fit Gym', area: 'Mandore', type: 'zumba' },
  { id: '6', name: 'Rishi Fitness Centre', area: 'City', type: 'yoga' },
  { id: '7', name: 'Trident Fitness', area: 'Rai Ka Bagh', type: 'mma' },
  { id: '8', name: 'Core Pilates Studio', area: 'Ratanada', type: 'pilates' },
  { id: '9', name: 'Blue City Aquatics', area: 'Pal', type: 'swimming' },
  { id: '10', name: 'Rhythm Dance Academy', area: 'Sardarpura', type: 'dance' },
  { id: '11', name: 'Jodhpur Cycling Club', area: 'Paota', type: 'cycling' },
  { id: '12', name: 'Zen Meditation Center', area: 'Mandore', type: 'meditation' },
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
    const bp = BASE_PRICES[c.type] || 1499
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
        duration_days: 1, price_inr: 199, is_featured: false,
        features: ['Single day access', 'All equipment access'] },
    ]
  })

  return [...allAccess, ...singleCenter]
}
