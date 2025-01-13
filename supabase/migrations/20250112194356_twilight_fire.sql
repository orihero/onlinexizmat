-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public access to telegram groups" ON telegram_groups;

-- Add new policy for public access
CREATE POLICY "Allow public access to telegram groups"
ON telegram_groups FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE telegram_groups ENABLE ROW LEVEL SECURITY;