import { FileType } from './types';
import { fileTypes } from './constants';

export const getExtensionsForFileTypes = (types: FileType[]): string[] => {
  return types.flatMap(type => {
    const fileType = fileTypes.find(ft => ft.value === type);
    return fileType?.description.split(', ') || [];
  });
};