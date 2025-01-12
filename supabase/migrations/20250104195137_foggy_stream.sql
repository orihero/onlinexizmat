/*
  # Fix categories access

  1. Changes
    - Add public access policy for categories table
    - Allow anonymous users to read categories
  
  2. Security
    - Enable RLS on categories table
    - Add policy for public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON categories;

-- Add new policies
CREATE POLICY "Allow public read access to categories"
ON categories FOR SELECT
TO public
USING (true);

-- Add policy for authenticated users to manage categories
CREATE POLICY "Allow authenticated users to manage categories"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);