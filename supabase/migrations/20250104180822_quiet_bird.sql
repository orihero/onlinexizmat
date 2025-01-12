/*
  # Update telegram_users RLS policies

  1. Changes
    - Drop existing RLS policy
    - Add new policies to allow:
      - Unauthenticated users to insert their own data
      - Authenticated users to manage all data
  
  2. Security
    - Enable RLS
    - Add specific policies for insert and management
*/

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON telegram_users;

-- Add new policies
CREATE POLICY "Allow telegram users to insert their own data"
ON telegram_users FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage all data"
ON telegram_users FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);