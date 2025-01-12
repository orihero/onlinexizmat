import { useState } from 'react';
import FormSelect from '../../../ui/FormSelect';

export type FileType = 'document' | 'photo' | 'audio' | 'video';

interface FileTypeSelectProps {
  value: FileType[];
  onChange: (value: FileType[]) => void;
  error?: string;
}

const fileTypes: { value: FileType; label: string; extensions: string[] }[] = [
  { 
    value: 'document', 
    label: 'Document', 
    extensions: ['doc', 'docx', 'txt', 'pdf', 'rtf']
  },
  { 
    value: 'photo', 
    label: 'Photo', 
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  },
  { 
    value: 'audio', 
    label: 'Audio', 
    extensions: ['mp3', 'wav', 'ogg', 'm4a']
  },
  { 
    value: 'video', 
    label: 'Video', 
    extensions: ['mp4', 'mov', 'avi', 'mkv']
  }
];

export default function FileTypeSelect({ value, onChange, error }: FileTypeSelectProps) {
  const [selectedTypes, setSelectedTypes] = useState<FileType[]>(value);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(option => option.value as FileType);
    setSelectedTypes(options);
    onChange(options);
  };

  return (
    <FormSelect
      label="Allowed File Types"
      value={selectedTypes}
      onChange={handleTypeChange}
      error={error}
      multiple
      size={4}
    >
      {fileTypes.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label} ({type.extensions.join(', ')})
        </option>
      ))}
    </FormSelect>
  );
}

export const getExtensionsForFileTypes = (types: FileType[]): string[] => {
  return types.flatMap(type => 
    fileTypes.find(ft => ft.value === type)?.extensions || []
  );
};