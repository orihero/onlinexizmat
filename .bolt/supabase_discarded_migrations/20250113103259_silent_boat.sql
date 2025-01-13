-- Add read status column
ALTER TABLE messages
ADD COLUMN read boolean NOT NULL DEFAULT false;

-- Add index for read status
CREATE INDEX IF NOT EXISTS messages_read_idx ON messages(read);

-- Set all existing messages as read
UPDATE messages SET read = true;