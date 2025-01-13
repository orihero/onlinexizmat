-- First alter the table to drop the default value
ALTER TABLE messages ALTER COLUMN status DROP DEFAULT;

-- Create the new enum type with a temporary name
CREATE TYPE message_status_new AS ENUM ('pending', 'sent', 'read', 'failed');

-- Update the column type using the USING clause to cast existing values
ALTER TABLE messages 
  ALTER COLUMN status TYPE message_status_new 
  USING (
    CASE status::text
      WHEN 'pending' THEN 'pending'::message_status_new
      WHEN 'sent' THEN 'sent'::message_status_new
      WHEN 'failed' THEN 'failed'::message_status_new
    END
  );

-- Drop the old enum type
DROP TYPE message_status;

-- Rename the new enum type to the original name
ALTER TYPE message_status_new RENAME TO message_status;

-- Restore the default value
ALTER TABLE messages ALTER COLUMN status SET DEFAULT 'sent'::message_status;

-- Update existing sent messages to read status
UPDATE messages 
SET status = 'read'
WHERE status = 'sent';