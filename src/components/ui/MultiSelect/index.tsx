import { forwardRef, useState } from 'react';
import Select from 'react-select';
import { cn } from '../../../lib/utils';
import { MultiSelectProps } from './types';
import { getMultiSelectStyles } from './styles';

const MultiSelect = forwardRef<any, MultiSelectProps>(
  ({ label, error, helperText, className, styles = {}, value, defaultValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined ? Array.isArray(value) && value.length > 0 : defaultValue;

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              "absolute left-3 z-10 transition-all duration-200 pointer-events-none",
              (isFocused || hasValue) 
                ? "-top-2.5 text-xs bg-white px-1 text-indigo-600"
                : "top-3 text-gray-500",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        <Select
          ref={ref}
          isMulti
          value={value}
          defaultValue={defaultValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
          styles={{
            ...getMultiSelectStyles,
            ...styles,
            control: (base, state) => ({
              ...getMultiSelectStyles.control?.(base, state),
              paddingTop: (isFocused || hasValue) ? '0.75rem' : '0',
              ...(error && {
                borderColor: '#FCA5A5',
                '&:hover': {
                  borderColor: '#FCA5A5'
                }
              }),
              ...styles?.control?.(base, state)
            })
          }}
          className={className}
        />
        {(error || helperText) && (
          <p className={cn(
            "text-xs mt-1",
            error ? "text-red-500" : "text-gray-500"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;