import { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, type = "text", value, defaultValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined ? !!value : !!defaultValue;

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              "absolute left-3 z-20 transition-all duration-200 pointer-events-none bg-white px-1",
              (isFocused || hasValue)
                ? "-top-2.5 text-xs text-indigo-600"
                : "top-2.5 text-gray-500",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => setIsFocused(e.target.value !== '')}
          className={cn(
            "block w-full px-3 py-2 text-gray-900 border rounded-md transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200",
            hasValue && "pt-4 pb-1",
            className
          )}
          {...props}
        />
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

FormInput.displayName = 'FormInput';

export default FormInput;