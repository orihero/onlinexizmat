import { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, className, children, value, defaultValue, multiple, size, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined ? !!value : !!defaultValue;

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              "absolute left-3 z-20 transition-all duration-200 pointer-events-none bg-white px-1",
              (isFocused || hasValue || multiple)
                ? "-top-2.5 text-xs text-indigo-600"
                : "top-2.5 text-gray-500",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            multiple={multiple}
            size={size}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => setIsFocused(e.target.value !== '')}
            className={cn(
              "block w-full px-3 py-2 text-gray-900 border rounded-md appearance-none transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200",
              multiple && "min-h-[120px]",
              hasValue && !multiple && "pt-4 pb-1",
              className
            )}
            {...props}
          >
            {children}
          </select>
          {!multiple && (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            "mt-1 text-xs",
            error ? "text-red-500" : "text-gray-500"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;