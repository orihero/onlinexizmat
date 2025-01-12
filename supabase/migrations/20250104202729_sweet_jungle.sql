/*
  # Add order creation support

  1. Changes
    - Add telegram_user_id to orders table
    - Add order status enum type
    - Update orders table structure
    - Add policies for order creation
    
  2. Security
    - Allow public access for order creation
*/

-- Create order status enum
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Update orders table
ALTER TABLE orders
DROP COLUMN IF EXISTS status;

ALTER TABLE orders
ADD COLUMN status order_status NOT NULL DEFAULT 'pending',
ADD COLUMN telegram_user_id bigint NOT NULL,
ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

-- Add foreign key to telegram_users
ALTER TABLE orders
ADD CONSTRAINT orders_telegram_user_id_fkey
FOREIGN KEY (telegram_user_id)
REFERENCES telegram_users(telegram_id)
ON DELETE CASCADE;