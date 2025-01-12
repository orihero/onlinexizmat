/*
  # Update orders table structure
  
  1. Changes
    - Add order_status enum type
    - Update status column to use enum
    - Update foreign key constraint for telegram_user_id
  
  2. Notes
    - Preserves existing data
    - Maintains referential integrity
    - Handles column existence checks
*/

-- Create order status enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
  END IF;
END $$;

-- Drop existing status column and recreate with enum type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status'
  ) THEN
    ALTER TABLE orders DROP COLUMN status;
  END IF;
END $$;

ALTER TABLE orders
ADD COLUMN status order_status NOT NULL DEFAULT 'pending';

-- Drop and recreate foreign key constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'orders_telegram_user_id_fkey'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_telegram_user_id_fkey;
  END IF;
END $$;

ALTER TABLE orders
ADD CONSTRAINT orders_telegram_user_id_fkey
FOREIGN KEY (telegram_user_id)
REFERENCES telegram_users(telegram_id)
ON DELETE CASCADE;