/*
  # Add public access policy for orders

  1. Changes
    - Drop existing restrictive policy
    - Add new policy allowing public to create orders
    - Add policy for authenticated users to manage all orders
    
  2. Security
    - Public users can only create orders
    - Authenticated users have full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON orders;

-- Add new policies
CREATE POLICY "Allow public to create orders"
ON orders FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public to read own orders"
ON orders FOR SELECT
TO public
USING (telegram_user_id = auth.uid());

-- Add policy for authenticated users to manage all orders
CREATE POLICY "Allow authenticated users to manage orders"
ON orders FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);