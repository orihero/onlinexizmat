export type FileType = 'document' | 'photo' | 'audio' | 'video';

export interface FileTypeOption {
  value: FileType;
  label: string;
  description: string;
}

export interface FileTypeSelectProps {
  value: FileType[];
  onChange: (value: FileType[]) => void;
  error?: string;
}