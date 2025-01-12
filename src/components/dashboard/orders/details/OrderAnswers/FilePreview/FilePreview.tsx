import { FileIcon, ImageIcon, Music2Icon, VideoIcon } from 'lucide-react';
import { FilePreviewProps } from './types';
import { ImagePreview } from './ImagePreview';
import { FileLink } from './FileLink';

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('audio/')) return Music2Icon;
  if (mimeType.startsWith('video/')) return VideoIcon;
  return FileIcon;
};

export function FilePreview({ answer }: FilePreviewProps) {
  const isImage = answer.file_type?.startsWith('image/');
  const Icon = getFileIcon(answer.file_type || '');

  if (isImage) {
    return (
      <ImagePreview 
        src={answer.answer} 
        alt={answer.original_name}
      />
    );
  }

  return (
    <FileLink
      url={answer.answer}
      name={answer.original_name}
      size={answer.file_size}
      icon={Icon}
    />
  );
}