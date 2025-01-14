import React, { useState } from 'react';
import { FileIcon, ImageIcon, Music2Icon, VideoIcon, Download, ExternalLink } from 'lucide-react';
import { formatFileSize } from '../../../lib/utils';

interface Message {
  content: string;
  file_type: string;
  original_name?: string;
  file_size?: number;
}

interface FilePreviewProps {
  message: Message;
}

export function FilePreview({ message }: FilePreviewProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const getFileIcon = () => {
    if (message.file_type?.startsWith('image/')) return ImageIcon;
    if (message.file_type?.startsWith('audio/')) return Music2Icon;
    if (message.file_type?.startsWith('video/')) return VideoIcon;
    return FileIcon;
  };

  const Icon = getFileIcon();
  const isImage = message.file_type?.startsWith('image/');
  const isVideo = message.file_type?.startsWith('video/');
  const isAudio = message.file_type?.startsWith('audio/');

  if (isImage) {
    return (
      <>
        <div className="relative">
          {!isImageLoaded && (
            <div className="flex items-center justify-center bg-gray-100 rounded-md h-48">
              <Icon className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <img
            src={message.content}
            alt={message.original_name || 'Image'}
            className="rounded-md max-h-48 object-contain cursor-pointer"
            onClick={() => setShowFullImage(true)}
            onLoad={() => setIsImageLoaded(true)}
            style={{ display: isImageLoaded ? 'block' : 'none' }}
          />
        </div>

        {showFullImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={() => setShowFullImage(false)}
          >
            <img
              src={message.content}
              alt={message.original_name || 'Image'}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </div>
        )}
      </>
    );
  }

  if (isVideo) {
    return (
      <div className="space-y-2">
        <video 
          src={message.content} 
          controls 
          className="rounded-md max-h-48 max-w-full"
        >
          Your browser does not support the video tag.
        </video>
        <div className="flex items-center justify-between text-sm">
          <span className="truncate">{message.original_name}</span>
          {message.file_size && (
            <span className="text-xs opacity-75">
              {formatFileSize(message.file_size)}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className="space-y-2">
        <audio 
          src={message.content} 
          controls 
          className="w-full"
        >
          Your browser does not support the audio tag.
        </audio>
        <div className="flex items-center justify-between text-sm">
          <span className="truncate">{message.original_name}</span>
          {message.file_size && (
            <span className="text-xs opacity-75">
              {formatFileSize(message.file_size)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 bg-white bg-opacity-10 rounded">
      <Icon className="w-8 h-8 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {message.original_name || 'File'}
        </div>
        {message.file_size && (
          <div className="text-xs opacity-75">
            {formatFileSize(message.file_size)}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <a
          href={message.content}
          download={message.original_name}
          className="p-1.5 hover:bg-white hover:bg-opacity-10 rounded"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </a>
        <a
          href={message.content}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 hover:bg-white hover:bg-opacity-10 rounded"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}