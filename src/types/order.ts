// Define all possible order statuses
export type OrderStatus = 'pending' | 'paid' | 'inprogress' | 'delivered' | 'completed' | 'cancelled';

export interface OrderAnswer {
  question_index: number;
  answer: string;
  file_type?: string;
  original_name?: string;
  file_size?: number;
}

export interface Order {
  id: string;
  service_id: string;
  status: OrderStatus;
  created_at: string;
  answers?: OrderAnswer[];
  files?: OrderAnswer[];
  telegram_users: {
    phone_number: string;
  };
  services: {
    name_uz: string;
    name_ru: string;
  };
}