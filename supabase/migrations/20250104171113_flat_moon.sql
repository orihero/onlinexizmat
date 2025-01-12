-- Enable storage
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create public bucket
INSERT INTO storage.buckets (id, name)
VALUES ('public', 'public')
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'public' );