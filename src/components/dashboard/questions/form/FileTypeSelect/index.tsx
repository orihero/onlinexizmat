import { useState } from 'react';
import MultiSelect from '../../../../ui/MultiSelect';
import { FileTypeSelectProps, FileType, FileTypeOption } from './types';
import { fileTypes } from './constants';

const formatOptionLabel = ({ label, description }: FileTypeOption) => (
  <div>
    <div className="font-medium">{label}</div>
    <div className="text-xs text-gray-500">{description}</div>
  </div>
);

export default function FileTypeSelect({ value, onChange, error }: FileTypeSelectProps) {
  const [selectedTypes, setSelectedTypes] = useState<FileTypeOption[]>(
    fileTypes.filter(type => value.includes(type.value))
  );

  const handleChange = (selected: FileTypeOption[]) => {
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

export * from './types';
export * from './utils';