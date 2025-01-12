import { LucideIcon } from 'lucide-react';
import { OrderAnswer } from '../../../../../../types/order';

export interface FilePreviewProps {
  answer: OrderAnswer;
}

export interface FileLinkProps {
  url: string;
  name?: string;
  size?: number;
  icon?: LucideIcon;
}

export interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
}