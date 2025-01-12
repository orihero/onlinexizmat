import { cn } from '../../lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function Form({ children, className, ...props }: FormProps) {
  return (
    <form className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  );
}

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
}