export interface ChatMessage {
  id: string;
  telegram_user_id: number;
  content: string;
  type: 'admin' | 'user';
  status: 'pending' | 'sent' | 'read' | 'failed';
  created_at: string;
  error_message?: string;
  telegram_message_id?: number;
  reply_to_message_id?: number;
  file_type?: string;
  original_name?: string;
  file_size?: number;
}