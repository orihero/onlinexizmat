import { forwardRef } from 'react';
import Select, { Props as SelectProps } from 'react-select';
import { cn } from '../../lib/utils';

export interface MultiSelectProps extends Omit<SelectProps, 'classNames'> {
  label?: string;
  error?: string;
  helperText?: string;
}

const MultiSelect = forwardRef<any, MultiSelectProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <Select
          ref={ref}
          isMulti
          {...props}
          classNames={{
            control: (state) => cn(
              "!min-h-[42px] !bg-white !border !rounded-md !shadow-sm",
              state.isFocused 
                ? "!border-indigo-500 !ring-1 !ring-indigo-500" 
                : "!border-gray-300",
              error && "!border-red-300 !ring-red-500",
              className
            ),
            placeholder: () => "!text-gray-400",
            input: () => "!text-gray-900",
            option: (state) => cn(
              "!cursor-pointer !py-2 !px-3",
              state.isFocused && "!bg-indigo-50",
              state.isSelected && "!bg-indigo-100 !text-indigo-800"
            ),
            multiValue: () => "!bg-indigo-100 !rounded-md",
            multiValueLabel: () => "!text-indigo-800 !py-1",
            multiValueRemove: () => "!text-indigo-500 hover:!bg-indigo-200 !rounded-r-md",
          }}
        />
        {(error || helperText) && (
          <p className={cn(
            "text-xs",
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