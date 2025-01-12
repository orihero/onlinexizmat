import { useState } from 'react';
import MultiSelect from '../../../ui/MultiSelect';

export type FileType = 'document' | 'photo' | 'audio' | 'video';

interface FileTypeSelectProps {
  value: FileType[];
  onChange: (value: FileType[]) => void;
  error?: string;
}

const fileTypes = [
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

const formatOptionLabel = ({ label, description }) => (
  <div className="flex flex-col">
    <span>{label}</span>
    <span className="text-xs text-gray-500">{description}</span>
  </div>
);

export default function FileTypeSelect({ value, onChange, error }: FileTypeSelectProps) {
  const [selectedTypes, setSelectedTypes] = useState(
    fileTypes.filter(type => value.includes(type.value as FileType))
  );

  const handleChange = (selected) => {
    setSelectedTypes(selected);
    onChange(selected.map(option => option.value));
  };

  return (
    <MultiSelect
      label="Allowed File Types"
      value={selectedTypes}
      onChange={handleChange}
      options={fileTypes}
      formatOptionLabel={formatOptionLabel}
      error={error}
      placeholder="Select file types..."
    />
  );
}

export const getExtensionsForFileTypes = (types: FileType[]): string[] => {
  return types.flatMap(type => {
    const fileType = fileTypes.find(ft => ft.value === type);
    return fileType?.description.split(', ') || [];
  });
};