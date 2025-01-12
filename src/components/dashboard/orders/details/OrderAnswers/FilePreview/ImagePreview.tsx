import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '../../../../../../lib/utils';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
}

export function ImagePreview({ src, alt, className }: ImagePreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-md h-48">
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="flex items-center justify-center bg-gray-100 rounded-md h-48">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt || 'Preview'}
        className={cn(
          "rounded-md max-h-48 object-contain",
          !isLoaded && "hidden",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}