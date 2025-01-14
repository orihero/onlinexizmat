-- Add file-related columns to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS file_type text,
ADD COLUMN IF NOT EXISTS original_name text,
ADD COLUMN IF NOT EXISTS file_size bigint;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS messages_file_type_idx ON messages(file_type);

-- Update RLS policies to allow access to new columns
DROP POLICY IF EXISTS "Allow public access to messages" ON messages;

CREATE POLICY "Allow public access to messages"
ON messages FOR ALL
TO public
USING (true)
WITH CHECK (true);