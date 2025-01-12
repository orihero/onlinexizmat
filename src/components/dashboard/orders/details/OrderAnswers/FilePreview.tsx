import { useState } from 'react';
import { FileIcon, ImageIcon, Music2Icon, VideoIcon } from 'lucide-react';
import { OrderAnswer } from '../../../../../types/order';

interface FilePreviewProps {
  answer: OrderAnswer;
}

export function FilePreview({ answer }: FilePreviewProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const getFileIcon = () => {
    if (answer.file_type?.startsWith('image/')) return ImageIcon;
    if (answer.file_type?.startsWith('audio/')) return Music2Icon;
    if (answer.file_type?.startsWith('video/')) return VideoIcon;
    return FileIcon;
  };

  const Icon = getFileIcon();
  const isImage = answer.file_type?.startsWith('image/');

  if (isImage) {
    return (
      <div className="relative">
        {!isImageLoaded && (
          <div className="flex items-center justify-center bg-gray-100 rounded-md h-48">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <img
          src={answer.answer}
          alt={answer.original_name || 'Image attachment'}
          className="rounded-md max-h-48 object-contain"
          onLoad={() => setIsImageLoaded(true)}
          style={{ display: isImageLoaded ? 'block' : 'none' }}
        />
      </div>
    );
  }

  return (
    <a
      href={answer.answer}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
    >
      <Icon className="w-5 h-5 text-gray-400 mr-3" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-indigo-600 hover:underline truncate block">
          {answer.original_name || 'Download attachment'}
        </span>
        {answer.file_size && (
          <span className="text-xs text-gray-500">
            {(answer.file_size / 1024).toFixed(1)} KB
          </span>
        )}
      </div>
    </a>
  );
}