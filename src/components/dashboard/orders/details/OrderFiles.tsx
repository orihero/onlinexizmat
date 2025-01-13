import { useState } from 'react';
import { Order } from '../../../../types/order';
import { FileIcon, ImageIcon, Music2Icon, VideoIcon, XIcon } from 'lucide-react';

interface OrderFilesProps {
  order: Order;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('audio/')) return Music2Icon;
  if (mimeType.startsWith('video/')) return VideoIcon;
  return FileIcon;
};

const getFileTypeLabel = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('audio/')) {
    if (mimeType === 'audio/ogg') return 'Voice Message';
    return 'Audio';
  }
  if (mimeType.startsWith('video/')) {
    if (mimeType === 'video/mp4' && !mimeType.includes('video_note')) return 'Video';
    return 'Video Message';
  }
  return 'Document';
};

interface PreviewModalProps {
  url: string;
  type: string;
  onClose: () => void;
}

function PreviewModal({ url, type, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
        >
          <XIcon className="w-6 h-6" />
        </button>
        
        {type.startsWith('image/') && (
          <img 
            src={url} 
            alt="Preview" 
            className="w-full h-full object-contain"
          />
        )}
        
        {type.startsWith('video/') && (
          <video 
            src={url} 
            controls 
            className="w-full max-h-[80vh]"
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        )}
        
        {type.startsWith('audio/') && (
          <div className="bg-white p-6 rounded-lg">
            <audio 
              src={url} 
              controls 
              className="w-full"
              controlsList="nodownload"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderFiles({ order }: OrderFilesProps) {
  const [previewFile, setPreviewFile] = useState<{ url: string; type: string } | null>(null);
  
  // Get all answers that contain file data
  const fileAnswers = order.answers?.filter(answer => answer.file_type);

  if (!fileAnswers?.length) return null;

  const handlePreview = (url: string, type: string) => {
    // Only preview media files
    if (type.startsWith('image/') || type.startsWith('video/') || type.startsWith('audio/')) {
      setPreviewFile({ url, type });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Attached Files</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fileAnswers.map((file, index) => {
          const Icon = getFileIcon(file.file_type);
          const fileType = getFileTypeLabel(file.file_type);
          const isPreviewable = file.file_type.startsWith('image/') || 
                               file.file_type.startsWith('video/') || 
                               file.file_type.startsWith('audio/');
          
          return (
            <div
              key={index}
              className={`flex items-center p-3 border border-gray-200 rounded-lg ${
                isPreviewable ? 'hover:bg-gray-50 cursor-pointer' : ''
              }`}
              onClick={() => isPreviewable && handlePreview(file.answer, file.file_type)}
            >
              <Icon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.original_name || fileType}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{fileType}</span>
                  {file.file_size && (
                    <>
                      <span>•</span>
                      <span>{(file.file_size / 1024).toFixed(1)} KB</span>
                    </>
                  )}
                </div>
              </div>
              {!isPreviewable && (
                <a
                  href={file.answer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {previewFile && (
        <PreviewModal
          url={previewFile.url}
          type={previewFile.type}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}