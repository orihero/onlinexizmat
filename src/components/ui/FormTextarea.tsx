import { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, className, value, defaultValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined ? !!value : !!defaultValue;

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              (isFocused || hasValue)
                ? "-top-2 text-xs bg-white px-1 text-indigo-600"
                : "top-3 text-gray-500",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => setIsFocused(e.target.value !== '')}
          className={cn(
            "block w-full px-3 py-2.5 text-gray-900 border rounded-md transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200",
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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;