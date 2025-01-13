-- Add telegram_message_id column to messages table
ALTER TABLE messages
ADD COLUMN telegram_message_id bigint,
ADD COLUMN reply_to_message_id bigint;

-- Add index for telegram_message_id
CREATE INDEX IF NOT EXISTS messages_telegram_message_id_idx ON messages(telegram_message_id);
CREATE INDEX IF NOT EXISTS messages_reply_to_message_id_idx ON messages(reply_to_message_id);