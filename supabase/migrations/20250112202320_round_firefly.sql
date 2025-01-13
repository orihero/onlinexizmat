-- Add new columns to telegram_users table
ALTER TABLE telegram_users
ADD COLUMN IF NOT EXISTS username text,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS birth_date date;

-- Create index for username
CREATE INDEX IF NOT EXISTS telegram_users_username_idx ON telegram_users(username);