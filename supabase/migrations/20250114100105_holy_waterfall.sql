/*
  # Fix order status enum

  1. Changes
    - Update order_status enum to include all valid statuses
    - Migrate existing data to new status values
    - Update default value for orders table

  2. Security
    - Maintain existing RLS policies
*/

-- First alter the table to drop the default value
ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;

-- Create the new enum type with a temporary name
CREATE TYPE order_status_new AS ENUM (
  'pending',
  'paid',
  'inprogress',
  'delivered',
  'completed',
  'cancelled'
);

-- Update the column type using the USING clause to cast existing values
ALTER TABLE orders 
  ALTER COLUMN status TYPE order_status_new 
  USING (
    CASE status::text
      WHEN 'confirmed' THEN 'paid'::order_status_new
      ELSE status::text::order_status_new
    END
  );

-- Drop the old enum type
DROP TYPE order_status;

-- Rename the new enum type to the original name
ALTER TYPE order_status_new RENAME TO order_status;

-- Restore the default value
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending'::order_status;