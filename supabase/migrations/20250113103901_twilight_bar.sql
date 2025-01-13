-- First alter the table to drop the default value
ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;

-- Create the new enum type with a temporary name
CREATE TYPE order_status_new AS ENUM (
  'pending',    -- Initial state when order is created
  'paid',       -- Order is paid and ready to work on
  'inprogress', -- Being worked on by admins
  'delivered',  -- Initial work done, awaiting client review
  'completed',  -- Client confirmed completion
  'cancelled'   -- Order cancelled before payment
);

-- Update the column type using the USING clause to cast existing values
ALTER TABLE orders 
  ALTER COLUMN status TYPE order_status_new 
  USING (
    CASE status::text
      WHEN 'pending' THEN 'pending'::order_status_new
      WHEN 'confirmed' THEN 'paid'::order_status_new
      WHEN 'completed' THEN 'completed'::order_status_new
      WHEN 'cancelled' THEN 'cancelled'::order_status_new
    END
  );

-- Drop the old enum type
DROP TYPE order_status;

-- Rename the new enum type to the original name
ALTER TYPE order_status_new RENAME TO order_status;

-- Restore the default value
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending'::order_status;