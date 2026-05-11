-- ============================================================
-- FITJODHPUR — SAFE RESET + CREATE SCHEMA
-- Drops existing tables first, then recreates everything.
-- Safe to run multiple times.
-- ============================================================

-- Step 1: Drop all tables (CASCADE removes dependent policies too)
DROP TABLE IF EXISTS public.payments          CASCADE;
DROP TABLE IF EXISTS public.check_ins         CASCADE;
DROP TABLE IF EXISTS public.class_bookings    CASCADE;
DROP TABLE IF EXISTS public.class_schedules   CASCADE;
DROP TABLE IF EXISTS public.member_subscriptions CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.fitness_centers   CASCADE;
DROP TABLE IF EXISTS public.profiles          CASCADE;

-- Drop old trigger and function if exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE 1: PROFILES
-- ============================================================
CREATE TABLE public.profiles (
    id             UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name      TEXT NOT NULL DEFAULT '',
    phone          TEXT,
    date_of_birth  DATE,
    avatar_url     TEXT,
    role           TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- TABLE 2: FITNESS CENTERS
-- ============================================================
CREATE TABLE public.fitness_centers (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          TEXT NOT NULL,
    type          TEXT NOT NULL,
    specialization TEXT,
    address       TEXT,
    area          TEXT NOT NULL,
    rating        NUMERIC(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    image_url     TEXT,
    opening_time  TEXT DEFAULT '06:00 AM',
    closing_time  TEXT DEFAULT '09:00 PM',
    amenities     TEXT[] DEFAULT '{}',
    is_active     BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fitness_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "centers_select"    ON public.fitness_centers FOR SELECT USING (true);
CREATE POLICY "centers_admin_all" ON public.fitness_centers FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE 3: SUBSCRIPTION PLANS
-- ============================================================
CREATE TABLE public.subscription_plans (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         TEXT NOT NULL,
    plan_type    TEXT NOT NULL CHECK (plan_type IN ('all_access', 'single_center')),
    center_id    UUID REFERENCES public.fitness_centers(id) ON DELETE CASCADE,
    duration_days INTEGER NOT NULL,
    price_inr    INTEGER NOT NULL,
    features     TEXT[] DEFAULT '{}',
    is_featured  BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_select"    ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "plans_admin_all" ON public.subscription_plans FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE 4: MEMBER SUBSCRIPTIONS
-- ============================================================
CREATE TABLE public.member_subscriptions (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id        UUID REFERENCES public.subscription_plans(id) NOT NULL,
    center_id      UUID REFERENCES public.fitness_centers(id),
    start_date     DATE NOT NULL,
    end_date       DATE NOT NULL,
    status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled','paused')),
    payment_method TEXT,
    amount_paid    INTEGER,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.member_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msubs_select" ON public.member_subscriptions FOR SELECT USING (auth.uid() = member_id);
CREATE POLICY "msubs_insert" ON public.member_subscriptions FOR INSERT WITH CHECK (auth.uid() = member_id);
CREATE POLICY "msubs_update" ON public.member_subscriptions FOR UPDATE USING (auth.uid() = member_id);
CREATE POLICY "msubs_admin"  ON public.member_subscriptions FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE 5: CLASS SCHEDULES
-- ============================================================
CREATE TABLE public.class_schedules (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id        UUID REFERENCES public.fitness_centers(id) ON DELETE CASCADE NOT NULL,
    class_name       TEXT NOT NULL,
    instructor_name  TEXT,
    class_type       TEXT,
    day_of_week      TEXT NOT NULL,
    start_time       TIME NOT NULL,
    end_time         TIME NOT NULL,
    max_capacity     INTEGER DEFAULT 20,
    current_bookings INTEGER DEFAULT 0,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedules_select" ON public.class_schedules FOR SELECT USING (true);
CREATE POLICY "schedules_admin"  ON public.class_schedules FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE 6: CLASS BOOKINGS
-- ============================================================
CREATE TABLE public.class_bookings (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    schedule_id  UUID REFERENCES public.class_schedules(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status       TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','attended')),
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_select" ON public.class_bookings FOR SELECT USING (auth.uid() = member_id);
CREATE POLICY "bookings_insert" ON public.class_bookings FOR INSERT WITH CHECK (auth.uid() = member_id);
CREATE POLICY "bookings_update" ON public.class_bookings FOR UPDATE USING (auth.uid() = member_id);
CREATE POLICY "bookings_admin"  ON public.class_bookings FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE 7: CHECK-INS
-- ============================================================
CREATE TABLE public.check_ins (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    center_id    UUID REFERENCES public.fitness_centers(id) ON DELETE CASCADE NOT NULL,
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    method       TEXT DEFAULT 'qr' CHECK (method IN ('qr','manual'))
);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checkins_select" ON public.check_ins FOR SELECT USING (auth.uid() = member_id);
CREATE POLICY "checkins_insert" ON public.check_ins FOR INSERT WITH CHECK (auth.uid() = member_id);
CREATE POLICY "checkins_admin"  ON public.check_ins FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TABLE 8: PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.member_subscriptions(id),
    amount          INTEGER NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('success','failed','pending')),
    method          TEXT,
    transaction_id  TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_select" ON public.payments FOR SELECT USING (auth.uid() = member_id);
CREATE POLICY "payments_insert" ON public.payments FOR INSERT WITH CHECK (auth.uid() = member_id);
CREATE POLICY "payments_admin"  ON public.payments FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- TRIGGER: Auto-create profile row on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- SEED: 10 FITNESS CENTERS
-- ============================================================
INSERT INTO public.fitness_centers
  (name, type, specialization, address, area, rating, total_reviews, amenities, image_url, opening_time, closing_time)
VALUES
  ('Equinox Fitness','gym','Body transformation, Personal training, Weight loss',
   'Residency Road, Near Circuit House','Ratanada',4.8,450,
   '{"AC","Parking","Locker","Shower","Diet Counseling","WiFi"}',
   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
   '05:30 AM','10:00 PM'),

  ('Fitbox Fitness Studio','gym','Group classes, Strength training, Functional fitness',
   'Paota Main Road, B Road','Paota',4.5,320,
   '{"AC","Locker","Steam Bath","Personal Training"}',
   'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
   '06:00 AM','09:00 PM'),

  ('Metalix Gym','gym','Bodybuilding, Powerlifting, Calisthenics',
   'Sardarpura 4th Road, Near Police Station','Sardarpura',4.7,510,
   '{"AC","Parking","Supplement Store","Locker"}',
   'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?auto=format&fit=crop&q=80&w=800',
   '05:00 AM','10:00 PM'),

  ('The Lift Gym','gym','Weightlifting, Cardio, Functional training',
   'Jodhpur City Center, Nai Sarak','City',4.4,280,
   '{"AC","Locker","Cardio Zone"}',
   'https://images.unsplash.com/photo-1571902953264-2431f63a39e4?auto=format&fit=crop&q=80&w=800',
   '06:00 AM','09:30 PM'),

  ('CrossFit Fitness Center','crossfit','High-intensity functional training, Olympic lifting',
   'Pal Road, Near Pal Overbridge','Pal',4.9,150,
   '{"Parking","Outdoor Area","Juice Bar","Pull-up Rigs"}',
   'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
   '05:30 AM','08:00 PM'),

  ('Sky Fit Gym','zumba','Zumba, Yoga, Dance fitness, Aerobics',
   'Mandore Road, Near Mandore Garden','Mandore',4.2,190,
   '{"AC","Changing Room","Sound System","Dance Floor"}',
   'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=800',
   '06:30 AM','08:30 PM'),

  ('Rishi Fitness Centre','yoga','Classical Yoga, Meditation, Pranayama',
   'City Center, Sojati Gate','City',4.6,210,
   '{"Meditation Hall","Parking","Yoga Props"}',
   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
   '06:00 AM','08:00 PM'),

  ('Athletic Gym & Fitness Center','gym','Athletic performance, Strength, Conditioning',
   'Residency Road, Near Bank of Baroda','Ratanada',4.3,240,
   '{"AC","Locker","Personal Training","Sports Zone"}',
   'https://images.unsplash.com/photo-1574673139054-93361e68220f?auto=format&fit=crop&q=80&w=800',
   '05:30 AM','09:30 PM'),

  ('Trident Fitness','mma','Mixed Martial Arts, Kickboxing, Boxing',
   'Circuit House Road, Rai Ka Bagh','Rai Ka Bagh',4.8,120,
   '{"MMA Ring","Punching Bags","Shower","Lockers"}',
   'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=800',
   '06:00 AM','09:00 PM'),

  ('Krishna MMA & Fitness','mma','Self-defense, Brazilian Jiu-jitsu, Muay Thai',
   'Old City, Near Clock Tower','City',4.5,95,
   '{"Mat Area","Locker","Sparring Gear"}',
   'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800',
   '07:00 AM','08:00 PM');

-- ============================================================
-- SEED: SUBSCRIPTION PLANS
-- ============================================================

-- All-Access
INSERT INTO public.subscription_plans (name, plan_type, duration_days, price_inr, features, is_featured) VALUES
  ('FitJodhpur All-Access Monthly','all_access',30,1499,
   '{"Access to all 10 centers","Unlimited class bookings","QR check-in","Free guest pass (1/month)"}',false),
  ('FitJodhpur All-Access Quarterly','all_access',90,3999,
   '{"Access to all 10 centers","Unlimited class bookings","QR check-in","Personal training x1","Nutrition guide"}',true),
  ('FitJodhpur All-Access Annual','all_access',365,12999,
   '{"Access to all 10 centers","Unlimited class bookings","QR check-in","Personal training x4","Premium health kit","Priority booking"}',false);

-- Single-center plans (4 per center × 10 centers = 40 plans)
DO $$
DECLARE
  c          RECORD;
  base_price INTEGER;
BEGIN
  FOR c IN SELECT id, name, type FROM public.fitness_centers LOOP
    base_price := CASE c.type
      WHEN 'crossfit' THEN 1299
      WHEN 'mma'      THEN 1199
      WHEN 'yoga'     THEN 799
      WHEN 'zumba'    THEN 699
      ELSE 899
    END;

    INSERT INTO public.subscription_plans (name,plan_type,center_id,duration_days,price_inr,features) VALUES
      (c.name||' — Monthly','single_center',c.id,30,base_price,
       ARRAY['Access to '||c.name||' only','Locker access','Trainer support']),
      (c.name||' — Quarterly','single_center',c.id,90,(base_price*3)-200,
       ARRAY['Access to '||c.name||' only','Locker access','Group class included']),
      (c.name||' — Annual','single_center',c.id,365,base_price*10,
       ARRAY['Access to '||c.name||' only','Locker access','2 months free','Personalized plan']),
      (c.name||' — Drop-In','single_center',c.id,1,199,
       ARRAY['Single day access','All equipment access']);
  END LOOP;
END $$;

-- ============================================================
-- SEED: CLASS SCHEDULES (4 slots × 6 days × 10 centers = 240)
-- ============================================================
DO $$
DECLARE
  c    RECORD;
  days TEXT[] := ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  d    TEXT;
  m1   TEXT; m2 TEXT; e1 TEXT; e2 TEXT;
  ins1 TEXT; ins2 TEXT;
BEGIN
  FOR c IN SELECT id, name, type FROM public.fitness_centers LOOP
    m1  := CASE c.type WHEN 'yoga' THEN 'Morning Yoga Flow' WHEN 'crossfit' THEN 'CrossFit WOD' WHEN 'mma' THEN 'Morning Drills' WHEN 'zumba' THEN 'Zumba Blast' ELSE 'Strength Training' END;
    m2  := CASE c.type WHEN 'yoga' THEN 'Pranayama & Meditation' WHEN 'crossfit' THEN 'Functional Fitness' WHEN 'mma' THEN 'Kickboxing Basics' WHEN 'zumba' THEN 'Dance Cardio' ELSE 'Cardio Bootcamp' END;
    e1  := CASE c.type WHEN 'yoga' THEN 'Evening Yoga' WHEN 'crossfit' THEN 'Evening WOD' WHEN 'mma' THEN 'Sparring Session' WHEN 'zumba' THEN 'Zumba Party' ELSE 'Hypertrophy Training' END;
    e2  := CASE c.type WHEN 'yoga' THEN 'Power Yoga' WHEN 'crossfit' THEN 'CrossFit AMRAP' WHEN 'mma' THEN 'BJJ Fundamentals' WHEN 'zumba' THEN 'Aerobics Fusion' ELSE 'Core & Abs' END;
    ins1 := CASE c.name WHEN 'Equinox Fitness' THEN 'Rahul Sharma' WHEN 'Fitbox Fitness Studio' THEN 'Anjali Singh' WHEN 'Metalix Gym' THEN 'Vikram Rathore' WHEN 'The Lift Gym' THEN 'Suresh Patel' WHEN 'CrossFit Fitness Center' THEN 'Deepak Joshi' WHEN 'Sky Fit Gym' THEN 'Priya Verma' WHEN 'Rishi Fitness Centre' THEN 'Rishi Gupta' WHEN 'Athletic Gym & Fitness Center' THEN 'Arun Mehta' WHEN 'Trident Fitness' THEN 'Sanjay Rawat' ELSE 'Krishna Yadav' END;
    ins2 := CASE c.name WHEN 'Equinox Fitness' THEN 'Neha Kapoor' WHEN 'Fitbox Fitness Studio' THEN 'Rohan Bhatt' WHEN 'Metalix Gym' THEN 'Pooja Rao' WHEN 'The Lift Gym' THEN 'Manoj Tiwari' WHEN 'CrossFit Fitness Center' THEN 'Sita Raman' WHEN 'Sky Fit Gym' THEN 'Kavita Nair' WHEN 'Rishi Fitness Centre' THEN 'Om Prakash' WHEN 'Athletic Gym & Fitness Center' THEN 'Ramesh Kulkarni' WHEN 'Trident Fitness' THEN 'Aakash Desai' ELSE 'Meena Jat' END;

    FOREACH d IN ARRAY days LOOP
      INSERT INTO public.class_schedules (center_id,class_name,instructor_name,class_type,day_of_week,start_time,end_time,max_capacity) VALUES
        (c.id, m1, ins1, c.type, d, '06:00', '07:00', 20),
        (c.id, m2, ins1, c.type, d, '07:00', '08:00', 20),
        (c.id, e1, ins2, c.type, d, '17:00', '18:00', 25),
        (c.id, e2, ins2, c.type, d, '18:00', '19:00', 25);
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- VERIFY (should show 10, 43, 240)
-- ============================================================
SELECT 'fitness_centers'    AS table_name, COUNT(*) AS rows FROM public.fitness_centers
UNION ALL
SELECT 'subscription_plans', COUNT(*) FROM public.subscription_plans
UNION ALL
SELECT 'class_schedules',    COUNT(*) FROM public.class_schedules;
