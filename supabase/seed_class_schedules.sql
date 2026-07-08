/* -------------------------------------------------------------
   SEED CLASS SCHEDULES (4 slots × 6 days × 10 centres = 240)
   ------------------------------------------------------------- */
DO $$
DECLARE
    c    RECORD;
    days TEXT[] := ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    d    TEXT;
    m1   TEXT;  m2 TEXT;  e1 TEXT;  e2 TEXT;
    ins1 TEXT;  ins2 TEXT;
BEGIN
    FOR c IN SELECT id, name, type FROM public.fitness_centers LOOP
        -- Morning slots
        m1 := CASE c.type
            WHEN 'yoga'     THEN 'Morning Yoga Flow'
            WHEN 'crossfit' THEN 'CrossFit WOD'
            WHEN 'mma'      THEN 'Morning Drills'
            WHEN 'zumba'    THEN 'Zumba Blast'
            ELSE 'Strength Training'
        END;
        m2 := CASE c.type
            WHEN 'yoga'     THEN 'Pranayama & Meditation'
            WHEN 'crossfit' THEN 'Functional Fitness'
            WHEN 'mma'      THEN 'Kickboxing Basics'
            WHEN 'zumba'    THEN 'Dance Cardio'
            ELSE 'Cardio Bootcamp'
        END;
        -- Evening slots
        e1 := CASE c.type
            WHEN 'yoga'     THEN 'Evening Yoga'
            WHEN 'crossfit' THEN 'Evening WOD'
            WHEN 'mma'      THEN 'Sparring Session'
            WHEN 'zumba'    THEN 'Zumba Party'
            ELSE 'Hypertrophy Training'
        END;
        e2 := CASE c.type
            WHEN 'yoga'     THEN 'Power Yoga'
            WHEN 'crossfit' THEN 'CrossFit AMRAP'
            WHEN 'mma'      THEN 'BJJ Fundamentals'
            WHEN 'zumba'    THEN 'Aerobics Fusion'
            ELSE 'Core & Abs'
        END;
        -- Instructors
        ins1 := CASE c.name
            WHEN 'Equinox Fitness'               THEN 'Rahul Sharma'
            WHEN 'Fitbox Fitness Studio'         THEN 'Anjali Singh'
            WHEN 'Metalix Gym'                     THEN 'Vikram Rathore'
            WHEN 'The Lift Gym'                    THEN 'Suresh Patel'
            WHEN 'CrossFit Fitness Center'         THEN 'Deepak Joshi'
            WHEN 'Sky Fit Gym'                     THEN 'Priya Verma'
            WHEN 'Rishi Fitness Centre'           THEN 'Rishi Gupta'
            WHEN 'Athletic Gym & Fitness Center'  THEN 'Arun Mehta'
            WHEN 'Trident Fitness'                 THEN 'Sanjay Rawat'
            ELSE 'Krishna Yadav'
        END;
        ins2 := CASE c.name
            WHEN 'Equinox Fitness'               THEN 'Neha Kapoor'
            WHEN 'Fitbox Fitness Studio'         THEN 'Rohan Bhatt'
            WHEN 'Metalix Gym'                     THEN 'Pooja Rao'
            WHEN 'The Lift Gym'                    THEN 'Manoj Tiwari'
            WHEN 'CrossFit Fitness Center'         THEN 'Sita Raman'
            WHEN 'Sky Fit Gym'                     THEN 'Kavita Nair'
            WHEN 'Rishi Fitness Centre'           THEN 'Om Prakash'
            WHEN 'Athletic Gym & Fitness Center'  THEN 'Ramesh Kulkarni'
            WHEN 'Trident Fitness'                 THEN 'Aakash Desai'
            ELSE 'Meena Jat'
        END;
        -- Insert rows for each day of the week
        FOREACH d IN ARRAY days LOOP
            INSERT INTO public.class_schedules
                (center_id, class_name, instructor_name, class_type,
                 day_of_week, start_time, end_time, max_capacity)
            VALUES
                (c.id, m1, ins1, c.type, d, '06:00', '07:00', 20),
                (c.id, m2, ins1, c.type, d, '07:00', '08:00', 20),
                (c.id, e1, ins2, c.type, d, '17:00', '18:00', 25),
                (c.id, e2, ins2, c.type, d, '18:00', '19:00', 25);
        END LOOP;
    END LOOP;
END $$;

/* -------------------------------------------------------------
   ENABLE ROW‑LEVEL SECURITY on provider tables
   ------------------------------------------------------------- */
ALTER TABLE public.provider_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_certifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_pricing_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_batches          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_holidays         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_media            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_youtube_links    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_enquiries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_reviews          ENABLE ROW LEVEL SECURITY;
