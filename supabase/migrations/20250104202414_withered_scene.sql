/*
  # Fix orders policy and add storage upload policy

  1. Changes
    - Drop and recreate orders policies to allow public access
    - Add storage policies for file uploads
    
  2. Security
    - Public users can create and read orders
    - Files can be uploaded to storage
*/

-- Drop existing policies for orders
DROP POLICY IF EXISTS "Allow public to create orders" ON orders;
DROP POLICY IF EXISTS "Allow public to read own orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to manage orders" ON orders;

-- Add new unrestricted public policy for orders
CREATE POLICY "Allow public access to orders"
ON orders FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add policy for authenticated users to manage orders
CREATE POLICY "Allow authenticated users to manage orders"
ON orders FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable storage for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to upload files
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'uploads'
);

-- Allow public to read uploaded files
CREATE POLICY "Allow public to read uploads"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'uploads'
);