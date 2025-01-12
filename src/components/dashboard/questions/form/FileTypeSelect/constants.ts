import { FileTypeOption } from './types';

export const fileTypes: FileTypeOption[] = [
  { 
    value: 'document', 
    label: 'Document', 
    description: 'doc, docx, txt, pdf, rtf'
  },
  { 
    value: 'photo', 
    label: 'Photo', 
    description: 'jpg, jpeg, png, gif, webp'
  },
  { 
    value: 'audio', 
    label: 'Audio', 
    description: 'mp3, wav, ogg, m4a'
  },
  { 
    value: 'video', 
    label: 'Video', 
    description: 'mp4, mov, avi, mkv'
  }
];