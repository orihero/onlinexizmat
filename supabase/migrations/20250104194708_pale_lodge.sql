/*
  # Add sample categories

  1. New Data
    - Adds sample categories in both Uzbek and Russian languages
    - Categories include common service types like:
      - Home Services
      - Electronics Repair
      - Auto Services
      - Beauty Services

  2. Changes
    - Inserts initial category data
*/

-- Insert sample categories
INSERT INTO categories (name_uz, name_ru, created_at)
VALUES 
  ('Uy xizmatlari', 'Домашние услуги', NOW()),
  ('Elektronika ta''mirlash', 'Ремонт электроники', NOW()),
  ('Avto xizmatlar', 'Авто услуги', NOW()),
  ('Go''zallik xizmatlari', 'Услуги красоты', NOW()),
  ('Ta''lim', 'Образование', NOW()),
  ('Yuridik xizmatlar', 'Юридические услуги', NOW());