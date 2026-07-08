-- ------------------------------------------------------------
-- 2024‑10‑01 – Ensure `role` column exists on `public.profiles`
-- ------------------------------------------------------------

-- 0️⃣  Extension (in case it was missing)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1️⃣  Add the column if it does not already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'profiles'
          AND column_name  = 'role'
    ) THEN
        ALTER TABLE public.profiles
            ADD COLUMN role TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('member','admin','provider'));
    END IF;
END $$;

-- 2️⃣  Back‑fill any rows that may have a NULL role (unlikely because of the DEFAULT)
UPDATE public.profiles SET role = 'member' WHERE role IS NULL;

-- 3️⃣  (Re)create the trigger that copies the JWT role claim into the profile row
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

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
    ON CONFLICT (id) DO UPDATE SET
        full_name  = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        role       = COALESCE(EXCLUDED.role, public.profiles.role);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4️⃣  Ensure every existing auth user now has a profile row (idempotent)
INSERT INTO public.profiles (id, full_name, avatar_url, role)
SELECT
    id,
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    raw_user_meta_data->>'avatar_url',
    COALESCE(raw_user_meta_data->>'role', 'member')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- End of migration
-- ------------------------------------------------------------

-- migration end (added newline)
