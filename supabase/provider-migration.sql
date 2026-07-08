-- ============================================================
-- FITJODHAR – PROVIDER MIGRATION (IDEMPOTENT)
-- Safe to re‑run – all objects are created ONLY IF they do NOT already exist.
-- ============================================================

-- 0️⃣ Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1️⃣ Core tables (if you already have them you can skip this section)
-- ------------------------------------------------------------
-- NOTE: Most core tables are already created by the main schema.  We only
-- include the provider specific tables here.

-- ------------------------------------------------------------
-- 2️⃣ Provider‑specific tables (IF NOT EXISTS)
-- ------------------------------------------------------------

-- Provider Profiles
CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id                UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name     TEXT NOT NULL,
    owner_name        TEXT NOT NULL,
    profile_photo     TEXT,
    category          TEXT NOT NULL,
    custom_category   TEXT,
    sub_specializations TEXT[] DEFAULT '{}',
    city              TEXT NOT NULL DEFAULT 'Jodhpur',
    area              TEXT NOT NULL,
    full_address      TEXT NOT NULL,
    is_online_only    BOOLEAN DEFAULT false,
    map_lat           NUMERIC(10,7),
    map_lng           NUMERIC(10,7),
    contact_number    TEXT NOT NULL,
    email             TEXT NOT NULL,
    website           TEXT,
    social_instagram  TEXT,
    social_youtube    TEXT,
    social_facebook   TEXT,
    social_twitter    TEXT,
    languages         TEXT[] DEFAULT '{"Hindi","English"}',
    bio               TEXT NOT NULL DEFAULT '',
    years_of_experience INTEGER DEFAULT 0,
    gender_preference TEXT DEFAULT 'all'
                         CHECK (gender_preference IN ('all','male_only','female_only')),
    age_groups        TEXT[] DEFAULT '{"all"}',
    category_fields   JSONB DEFAULT '{}'::jsonb,
    listing_status    TEXT DEFAULT 'under_review'
                         CHECK (listing_status IN ('active','paused','under_review')),
    profile_completion_percent INTEGER DEFAULT 0,
    has_free_trial    BOOLEAN DEFAULT false,
    has_online_sessions BOOLEAN DEFAULT false,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Certifications
CREATE TABLE IF NOT EXISTS public.provider_certifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
    name        TEXT NOT NULL,
    url         TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Pricing Plans
CREATE TABLE IF NOT EXISTS public.provider_pricing_plans (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id  UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
    label        TEXT NOT NULL,   -- e.g. "Monthly Membership"
    price        INTEGER NOT NULL, -- INR
    duration     TEXT NOT NULL,   -- e.g. "1 month", "per session"
    description  TEXT,
    is_popular   BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Batches (class‑style schedule blocks)
CREATE TABLE IF NOT EXISTS public.provider_batches (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id       UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
    day_of_week       TEXT NOT NULL
                       CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
    start_time        TIME NOT NULL,
    end_time          TIME NOT NULL,
    capacity          INTEGER NOT NULL DEFAULT 20,
    current_occupancy INTEGER NOT NULL DEFAULT 0,
    session_type      TEXT DEFAULT 'group'
                       CHECK (session_type IN ('group','individual','both')),
    batch_name        TEXT,
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Holidays
CREATE TABLE IF NOT EXISTS public.provider_holidays (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
    date        DATE NOT NULL,
    reason      TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Media (images / videos)
CREATE TABLE IF NOT EXISTS public.provider_media (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('image','video')),
    url         TEXT NOT NULL,
    thumbnail   TEXT,
    caption     TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider YouTube Links
CREATE TABLE IF NOT EXISTS public.provider_youtube_links (
    provider_id UUID PRIMARY KEY REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    embed_id    TEXT NOT NULL
);

-- Provider Enquiries (leads)
CREATE TABLE IF NOT EXISTS public.provider_enquiries (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id      UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
    user_name        TEXT NOT NULL,
    user_phone       TEXT NOT NULL,
    user_email       TEXT,
    message          TEXT NOT NULL,
    preferred_timing TEXT,
    status           TEXT DEFAULT 'new'
                       CHECK (status IN ('new','contacted','follow_up','archived')),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    contacted_at     TIMESTAMPTZ,
    follow_up_date   DATE,
    notes            TEXT
);

-- Provider Reviews
CREATE TABLE IF NOT EXISTS public.provider_reviews (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id  UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
    user_name    TEXT NOT NULL,
    user_avatar  TEXT,
    rating       INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment      TEXT NOT NULL,
    reply        TEXT,
    replied_at   TIMESTAMPTZ,
    is_flagged   BOOLEAN DEFAULT false,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3️⃣ Row‑level security policies (INSERT only – safe to re‑run)
-- ------------------------------------------------------------
-- Helper to drop existing INSERT policies if they already exist
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS provider_profiles_insert ON public.provider_profiles';
    EXECUTE 'DROP POLICY IF EXISTS provider_certifications_insert ON public.provider_certifications';
    EXECUTE 'DROP POLICY IF EXISTS provider_pricing_plans_insert ON public.provider_pricing_plans';
    EXECUTE 'DROP POLICY IF EXISTS provider_batches_insert ON public.provider_batches';
    EXECUTE 'DROP POLICY IF EXISTS provider_holidays_insert ON public.provider_holidays';
    EXECUTE 'DROP POLICY IF EXISTS provider_media_insert ON public.provider_media';
    EXECUTE 'DROP POLICY IF EXISTS provider_youtube_links_insert ON public.provider_youtube_links';
    EXECUTE 'DROP POLICY IF EXISTS provider_enquiries_insert ON public.provider_enquiries';
    EXECUTE 'DROP POLICY IF EXISTS provider_reviews_insert ON public.provider_reviews';
END $$;

-- Provider Profiles – owner can create their own row (id = auth.uid())
CREATE POLICY provider_profiles_insert ON public.provider_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Provider Certifications – owner can insert
CREATE POLICY provider_certifications_insert ON public.provider_certifications
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Provider Pricing Plans – owner can insert
CREATE POLICY provider_pricing_plans_insert ON public.provider_pricing_plans
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Provider Batches – owner can insert
CREATE POLICY provider_batches_insert ON public.provider_batches
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Provider Holidays – owner can insert
CREATE POLICY provider_holidays_insert ON public.provider_holidays
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Provider Media – owner can insert
CREATE POLICY provider_media_insert ON public.provider_media
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Provider YouTube Links – owner can insert
CREATE POLICY provider_youtube_links_insert ON public.provider_youtube_links
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Provider Enquiries – owner can insert (leads belong to provider)
CREATE POLICY provider_enquiries_insert ON public.provider_enquiries
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- Provider Reviews – owner can insert (provider replies are updates, not inserts)
CREATE POLICY provider_reviews_insert ON public.provider_reviews
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- ------------------------------------------------------------
-- 4️⃣ Auth trigger – make it idempotent (drop if exists first)
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------
-- 5️⃣ Verification (optional)
-- ------------------------------------------------------------
SELECT tablename, count(*) FROM pg_tables WHERE schemaname = 'public' GROUP BY tablename;

-- End of migration script
