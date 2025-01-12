/*
  # Setup file storage and policies
  
  1. Changes
    - Create uploads bucket if not exists
    - Add storage policies for public access
    - Add file metadata columns to orders table
  
  2. Security
    - Enable public access for file uploads
    - Allow reading uploaded files
*/

-- Ensure uploads bucket exists
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

-- Add file metadata columns to orders if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'files'
  ) THEN
    ALTER TABLE orders
    ADD COLUMN files jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;