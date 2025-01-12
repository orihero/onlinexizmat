/*
  # Update Services and Questions Schema

  1. Changes to Services Table
    - Add base_price column
  
  2. Changes to Questions Table
    - Add type column (enum)
    - Add price column
    - Add file_extensions column (for file type questions)
  
  3. Security
    - Update RLS policies
*/

-- Create question type enum
CREATE TYPE question_type AS ENUM ('yes_no', 'text', 'file', 'picture');

-- Update questions table
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS type question_type NOT NULL DEFAULT 'text',
ADD COLUMN IF NOT EXISTS price decimal(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS file_extensions text[] DEFAULT NULL;

-- Add base price to services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS base_price decimal(10,2) NOT NULL DEFAULT 0;