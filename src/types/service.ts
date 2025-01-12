export interface Service {
  id: string;
  category_id: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  base_price: number;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  categories: {
    name_uz: string;
    name_ru: string;
  };
}