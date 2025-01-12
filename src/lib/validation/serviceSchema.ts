import { z } from 'zod';

// Constants for validation rules
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_PRICE = 0;
const MAX_PRICE = 1000000000; // 1 billion
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const serviceSchema = z.object({
  category_id: z.string().uuid('Invalid category ID'),
  name_uz: z.string()
    .min(1, 'Name in Uzbek is required')
    .max(MAX_NAME_LENGTH, `Name must be less than ${MAX_NAME_LENGTH} characters`),
  name_ru: z.string()
    .min(1, 'Name in Russian is required')
    .max(MAX_NAME_LENGTH, `Name must be less than ${MAX_NAME_LENGTH} characters`),
  description_uz: z.string()
    .min(1, 'Description in Uzbek is required')
    .max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`),
  description_ru: z.string()
    .min(1, 'Description in Russian is required')
    .max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`),
  base_price: z.number()
    .min(MIN_PRICE, 'Price cannot be negative')
    .max(MAX_PRICE, 'Price is too high'),
  photo_url: z.string().url().optional().nullable(),
});

export const serviceImageSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    'Only JPEG, PNG and WebP images are allowed'
  ).refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    'Image size must be less than 5MB'
  ),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;