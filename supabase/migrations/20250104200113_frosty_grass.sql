/*
  # Add user service state table

  1. New Tables
    - `user_service_state` - Tracks user's current service interaction state
      - `telegram_user_id` (bigint, primary key)
      - `service_id` (uuid, references services)
      - `current_question_index` (integer)
      - `answers` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add `answers` column to orders table
    
  3. Security
    - Enable RLS
    - Add policies for public access
*/

-- Create user service state table
CREATE TABLE IF NOT EXISTS user_service_state (
  telegram_user_id bigint PRIMARY KEY,
  service_id uuid REFERENCES services(id),
  current_question_index integer NOT NULL DEFAULT 0,
  answers jsonb[] DEFAULT array[]::jsonb[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add answers column to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS answers jsonb[] DEFAULT array[]::jsonb[];

-- Enable RLS
ALTER TABLE user_service_state ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public access to user service state"
ON user_service_state FOR ALL
TO public
USING (true)
WITH CHECK (true);