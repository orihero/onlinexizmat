-- Create message type enum if it doesn't exist
CREATE TYPE message_type AS ENUM ('admin', 'user');

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id bigint REFERENCES telegram_users(telegram_id),
  content text NOT NULL,
  type message_type NOT NULL,
  status message_status DEFAULT 'sent',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  error_message text
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public access to messages"
ON messages FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS messages_user_id_idx ON messages(telegram_user_id);
CREATE INDEX IF NOT EXISTS messages_type_idx ON messages(type);
CREATE INDEX IF NOT EXISTS messages_status_idx ON messages(status);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);

-- Migrate data from chat_messages
INSERT INTO messages (telegram_user_id, content, type, status, created_at, updated_at)
SELECT 
  telegram_user_id,
  message,
  CASE 
    WHEN direction = 'inbound' THEN 'user'::message_type
    ELSE 'admin'::message_type
  END,
  'sent'::message_status,
  created_at,
  updated_at
FROM chat_messages;

-- Migrate data from admin_messages
INSERT INTO messages (telegram_user_id, content, type, status, created_at, updated_at, error_message)
SELECT 
  telegram_user_id,
  message,
  'admin'::message_type,
  status,
  created_at,
  COALESCE(sent_at, updated_at),
  error_message
FROM admin_messages;

-- Drop old tables
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS admin_messages;