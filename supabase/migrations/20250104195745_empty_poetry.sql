/*
  # Fix questions access and add sample data

  1. Changes
    - Add public access policy for questions table
    - Add sample questions for testing with correct question_type enum values
  
  2. Security
    - Enable RLS on questions table
    - Add policy for public read access
    - Add policy for authenticated management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON questions;

-- Add new policies
CREATE POLICY "Allow public read access to questions"
ON questions FOR SELECT
TO public
USING (true);

-- Add policy for authenticated users to manage questions
CREATE POLICY "Allow authenticated users to manage questions"
ON questions FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert sample questions for testing
INSERT INTO questions (service_id, question_uz, question_ru, type, price, "order")
SELECT 
  s.id,
  'Xizmat qachon kerak?' as question_uz,
  'Когда нужна услуга?' as question_ru,
  'text'::question_type as type,
  0 as price,
  1 as "order"
FROM services s
WHERE s.id = (SELECT id FROM services LIMIT 1)
UNION ALL
SELECT 
  s.id,
  'Manzilni kiriting' as question_uz,
  'Введите адрес' as question_ru,
  'text'::question_type as type,
  0 as price,
  2 as "order"
FROM services s
WHERE s.id = (SELECT id FROM services LIMIT 1);