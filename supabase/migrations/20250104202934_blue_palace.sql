-- Create order status enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
  END IF;
END $$;

-- Update orders table
ALTER TABLE orders
DROP COLUMN IF EXISTS status;

ALTER TABLE orders
ADD COLUMN status order_status NOT NULL DEFAULT 'pending',
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

-- Drop existing foreign key if exists
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_telegram_user_id_fkey;

-- Add foreign key to telegram_users
ALTER TABLE orders
ADD CONSTRAINT orders_telegram_user_id_fkey
FOREIGN KEY (telegram_user_id)
REFERENCES telegram_users(telegram_id)
ON DELETE CASCADE;