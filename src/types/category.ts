export interface TelegramGroup {
  id: string;
  group_id: number;
  name: string;
  photo_url: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  group_id: string | null;
  created_at: string;
  telegram_groups?: TelegramGroup;
}