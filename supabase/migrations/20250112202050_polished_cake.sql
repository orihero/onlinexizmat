-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id bigint REFERENCES telegram_users(telegram_id),
  message text NOT NULL,
  direction text CHECK (direction IN ('inbound', 'outbound')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public access to chat messages"
ON chat_messages FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(telegram_user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);