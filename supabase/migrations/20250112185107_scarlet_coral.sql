/*
  # Add file_types column to questions table

  1. Changes
    - Add file_types column to questions table to store allowed file types
    - Update existing file questions with default file types
*/

-- Add file_types column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'file_types'
  ) THEN
    ALTER TABLE questions
    ADD COLUMN file_types text[] DEFAULT NULL;
  END IF;
END $$;

-- Update existing file type questions with default file types
UPDATE questions
SET file_types = ARRAY['document', 'photo']
WHERE type = 'file' AND file_types IS NULL;

UPDATE questions 
SET file_types = ARRAY['photo']
WHERE type = 'picture' AND file_types IS NULL;