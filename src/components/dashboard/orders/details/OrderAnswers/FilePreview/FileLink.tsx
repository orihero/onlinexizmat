import { FileIcon, LucideIcon } from 'lucide-react';
import { formatFileSize } from '../../../../../../lib/utils';

interface FileLinkProps {
  url: string;
  name?: string;
  size?: number;
  icon?: LucideIcon;
}

export function FileLink({ url, name, size, icon: Icon = FileIcon }: FileLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
    >
      <Icon className="w-5 h-5 text-gray-400 mr-3" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-indigo-600 hover:underline truncate block">
          {name || 'Download file'}
        </span>
        {size && (
          <span className="text-xs text-gray-500">
            {formatFileSize(size)}
          </span>
        )}
      </div>
    </a>
  );
}