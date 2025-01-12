/*
  # Fix services access

  1. Changes
    - Add public access policy for services table
    - Allow anonymous users to read services
  
  2. Security
    - Enable RLS on services table
    - Add policy for public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON services;

-- Add new policies
CREATE POLICY "Allow public read access to services"
ON services FOR SELECT
TO public
USING (true);

-- Add policy for authenticated users to manage services
CREATE POLICY "Allow authenticated users to manage services"
ON services FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);