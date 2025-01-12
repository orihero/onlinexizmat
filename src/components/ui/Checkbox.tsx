import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500",
            error && "border-red-300",
            className
          )}
          {...props}
        />
        {label && (
          <label className="ml-2 block text-sm text-gray-900">
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;