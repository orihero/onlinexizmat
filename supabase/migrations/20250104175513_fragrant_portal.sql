/*
  # Add order field to questions

  1. Changes
    - Add `order` column to questions table with default value
    - Update existing questions to have sequential order based on creation date
  
  2. Notes
    - Default order is 0 for new questions
    - Existing questions will be ordered by creation date
*/

-- Add order column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;

-- Update existing questions with sequential order based on creation date
DO $$
DECLARE
  q RECORD;
  counter INTEGER := 1;
BEGIN
  FOR q IN (
    SELECT id 
    FROM questions 
    ORDER BY created_at
  ) LOOP
    UPDATE questions 
    SET "order" = counter 
    WHERE id = q.id;
    
    counter := counter + 1;
  END LOOP;
END $$;