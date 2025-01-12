/*
  # Add Telegram Groups Support
  
  1. New Tables
    - telegram_groups
      - id (uuid, primary key)
      - group_id (bigint, unique)
      - name (text)
      - photo_url (text, nullable)
      - member_count (int)
      - created_at (timestamp)
      - updated_at (timestamp)
  
  2. Changes
    - Add group_id column to categories table
    - Add foreign key relationship
  
  3. Security
    - Enable RLS on telegram_groups
    - Add policies for authenticated users
*/

-- Create telegram_groups table
CREATE TABLE IF NOT EXISTS telegram_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id bigint UNIQUE NOT NULL,
  name text NOT NULL,
  photo_url text,
  member_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add group_id to categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES telegram_groups(id);

-- Enable RLS
ALTER TABLE telegram_groups ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow full access to authenticated users"
ON telegram_groups FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Create admin user if not exists
DO $$ 
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'aka.orihero@gmail.com',
    crypt('admin123456', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'aka.orihero@gmail.com'
  );
END $$;