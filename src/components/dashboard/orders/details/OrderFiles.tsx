import { Order } from '../../../../types/order';
import { FileIcon, ImageIcon, Music2Icon, VideoIcon } from 'lucide-react';

interface OrderFilesProps {
  order: Order;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('audio/')) return Music2Icon;
  if (mimeType.startsWith('video/')) return VideoIcon;
  return FileIcon;
};

export default function OrderFiles({ order }: OrderFilesProps) {
  if (!order.files?.length) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Attached Files</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {order.files.map((file, index) => {
          const Icon = getFileIcon(file.file_type);
          return (
            <a
              key={index}
              href={file.answer}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Icon className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.original_name}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.file_size / 1024).toFixed(1)} KB
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}