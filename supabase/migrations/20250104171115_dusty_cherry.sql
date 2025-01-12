-- Add photo_url to services
ALTER TABLE services
ADD COLUMN IF NOT EXISTS photo_url text;