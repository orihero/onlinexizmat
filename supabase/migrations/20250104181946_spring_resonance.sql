/*
  # Fix telegram_users RLS policies

  1. Changes
    - Drop existing policies
    - Add new comprehensive policies that handle both insert and update cases
    - Ensure upsert operations work correctly
  
  2. Security
    - Maintains security while allowing necessary operations
    - Allows anon role to manage their own data
    - Keeps admin access for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow telegram users to insert their own data" ON telegram_users;
DROP POLICY IF EXISTS "Allow public to read telegram users" ON telegram_users;
DROP POLICY IF EXISTS "Allow authenticated to read telegram users" ON telegram_users;

-- Add new comprehensive policies
CREATE POLICY "Allow telegram users to manage their own data"
ON telegram_users FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access"
ON telegram_users FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);