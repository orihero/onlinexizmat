import { Props as SelectProps } from 'react-select';

export interface MultiSelectProps extends Omit<SelectProps, 'classNames'> {
  label?: string;
  error?: string;
  helperText?: string;
}