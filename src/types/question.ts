export type QuestionType = 'yes_no' | 'text' | 'file' | 'picture';

export interface Question {
  id: string;
  service_id: string;
  question_uz: string;
  question_ru: string;
  type: QuestionType;
  price: number;
  order: number;
  file_extensions?: string[];
  created_at: string;
  updated_at: string;
  services?: {
    name_uz: string;
    name_ru: string;
  };
}