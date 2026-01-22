-- Add foreign key from jobs.user_id to profiles.id
-- This allows Supabase to resolve the relationship for embedded queries

ALTER TABLE public.jobs 
  DROP CONSTRAINT IF EXISTS jobs_user_id_fkey;

ALTER TABLE public.jobs 
  ADD CONSTRAINT jobs_user_id_profiles_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;
