-- Drop existing message_status type if exists
DROP TYPE IF EXISTS message_status;

-- Recreate message_status enum with read status
CREATE TYPE message_status AS ENUM ('pending', 'sent', 'read', 'failed');

-- Update existing messages to use new status
UPDATE messages 
SET status = 'read'::message_status 
WHERE status = 'sent';