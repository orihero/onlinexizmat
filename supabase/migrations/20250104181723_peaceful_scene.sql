-- Add SELECT policy for telegram_users
CREATE POLICY "Allow public to read telegram users"
ON telegram_users FOR SELECT
TO public
USING (true);

-- Add SELECT policy for authenticated users
CREATE POLICY "Allow authenticated to read telegram users"
ON telegram_users FOR SELECT
TO authenticated
USING (true);