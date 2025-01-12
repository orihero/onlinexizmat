/*
  # Storage and Order Updates
  
  1. Changes
    - Add file metadata column to orders table
    - Ensure uploads bucket exists
    - Add storage policies if not exist
  
  2. Security
    - Allow public access to uploaded files
*/

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

-- Ensure uploads bucket exists
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('uploads', 'uploads', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Add storage policies if they don't exist
DO $$
BEGIN
  -- Check and create upload policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow public uploads' 
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Allow public uploads"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'uploads');
  END IF;

  -- Check and create read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow public to read uploads' 
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Allow public to read uploads"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'uploads');
  END IF;
END $$;