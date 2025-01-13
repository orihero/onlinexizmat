/*
  # Admin Messaging Implementation

  1. New Tables
    - `admin_messages` - Stores messages sent from admin panel
      - `id` (uuid, primary key)
      - `telegram_user_id` (bigint, references telegram_users)
      - `message` (text)
      - `status` (enum: pending, sent, failed)
      - `created_at` (timestamptz)
      - `sent_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public access
*/

-- Create message status enum
CREATE TYPE message_status AS ENUM ('pending', 'sent', 'failed');

-- Create admin messages table
CREATE TABLE IF NOT EXISTS admin_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id bigint REFERENCES telegram_users(telegram_id),
  message text NOT NULL,
  status message_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  error_message text
);

-- Enable RLS
ALTER TABLE admin_messages ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public access to admin messages"
ON admin_messages FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS admin_messages_user_id_idx ON admin_messages(telegram_user_id);
CREATE INDEX IF NOT EXISTS admin_messages_status_idx ON admin_messages(status);
CREATE INDEX IF NOT EXISTS admin_messages_created_at_idx ON admin_messages(created_at);