import { StylesConfig } from 'react-select';

export const getMultiSelectStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    minHeight: '42px',
    background: 'white',
    borderColor: state.isFocused ? '#6366F1' : '#D1D5DB',
    boxShadow: state.isFocused ? '0 0 0 1px #6366F1' : 'none',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: state.isFocused ? '#6366F1' : '#D1D5DB'
    }
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '2px 8px'
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50
  }),
  option: (base, state) => ({
    ...base,
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    backgroundColor: state.isSelected 
      ? '#EEF2FF'
      : state.isFocused 
        ? '#F3F4F6'
        : 'white',
    color: state.isSelected ? '#4F46E5' : '#111827',
    '&:active': {
      backgroundColor: '#EEF2FF'
    }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#EEF2FF',
    borderRadius: '4px',
    margin: '2px'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#4F46E5',
    padding: '2px 4px'
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#4F46E5',
    ':hover': {
      backgroundColor: '#E0E7FF',
      color: '#4338CA'
    }
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9CA3AF'
  }),
  input: (base) => ({
    ...base,
    color: '#111827',
    margin: '2px'
  })
};