import { cn } from '../../lib/utils';

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export default function ButtonGroup({ children, className, align = 'right' }: ButtonGroupProps) {
  return (
    <div className={cn(
      "flex gap-4",
      align === 'left' && "justify-start",
      align === 'center' && "justify-center",
      align === 'right' && "justify-end",
      className
    )}>
      {children}
    </div>
  );
}