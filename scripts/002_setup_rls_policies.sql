-- Enable RLS on all tables (already enabled, but confirming)
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visit_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Practices table policies
-- Allow users to insert their own practices
CREATE POLICY "Users can create practices"
ON practices FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Allow users to view practices they created
CREATE POLICY "Users can view own practices"
ON practices FOR SELECT
USING (auth.uid() = created_by);

-- Allow users to update their own practices
CREATE POLICY "Users can update own practices"
ON practices FOR UPDATE
USING (auth.uid() = created_by);

-- Profiles table policies
-- Allow users to view all profiles (for explorer/worker assignment)
CREATE POLICY "Anyone can view profiles"
ON profiles FOR SELECT
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Practice phases policies
-- Allow users to view phases of their practices
CREATE POLICY "Users can view phases of their practices"
ON practice_phases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = practice_phases.practice_id
    AND practices.created_by = auth.uid()
  )
  OR assigned_to = auth.uid()
);

-- Allow users to create phases on their practices
CREATE POLICY "Users can create phases on their practices"
ON practice_phases FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = practice_phases.practice_id
    AND practices.created_by = auth.uid()
  )
);

-- Allow users to update phases assigned to them or on their practices
CREATE POLICY "Users can update phases assigned to them"
ON practice_phases FOR UPDATE
USING (
  assigned_to = auth.uid()
  OR EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = practice_phases.practice_id
    AND practices.created_by = auth.uid()
  )
);

-- Site visits policies
-- Allow explorers to view site visits assigned to them
CREATE POLICY "Explorers can view their site visits"
ON site_visits FOR SELECT
USING (
  explorer_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = (
      SELECT practice_id FROM practice_phases
      WHERE practice_phases.id = site_visits.phase_id
    )
    AND practices.created_by = auth.uid()
  )
);

-- Allow admins to create site visits for their practices
CREATE POLICY "Admins can create site visits"
ON site_visits FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = (
      SELECT practice_id FROM practice_phases
      WHERE practice_phases.id = site_visits.phase_id
    )
    AND practices.created_by = auth.uid()
  )
);

-- Site visit forms policies
-- Allow explorers to submit forms
CREATE POLICY "Explorers can submit site visit forms"
ON site_visit_forms FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM site_visits
    WHERE site_visits.id = site_visit_forms.site_visit_id
    AND site_visits.explorer_id = auth.uid()
  )
);

-- Practice chat policies
-- Allow users to view chat for their practices or assigned phases
CREATE POLICY "Users can view practice chat"
ON practice_chat FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = practice_chat.practice_id
    AND practices.created_by = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM practice_phases
    WHERE practice_phases.practice_id = practice_chat.practice_id
    AND practice_phases.assigned_to = auth.uid()
  )
);

-- Allow users to post messages
CREATE POLICY "Users can post messages"
ON practice_chat FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    EXISTS (
      SELECT 1 FROM practices
      WHERE practices.id = practice_chat.practice_id
      AND practices.created_by = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM practice_phases
      WHERE practice_phases.practice_id = practice_chat.practice_id
      AND practice_phases.assigned_to = auth.uid()
    )
  )
);

-- Invoices policies
-- Allow users to view invoices for their practices
CREATE POLICY "Users can view invoices"
ON invoices FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = invoices.practice_id
    AND practices.created_by = auth.uid()
  )
);

-- Allow users to create invoices for their practices
CREATE POLICY "Users can create invoices"
ON invoices FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM practices
    WHERE practices.id = invoices.practice_id
    AND practices.created_by = auth.uid()
  )
);

-- Notifications policies
-- Allow users to view their notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);
