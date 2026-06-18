import { type ReactNode } from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  glass?: boolean;
}

export default function Card({ children, className, title, subtitle, action, glass = true }: CardProps) {
  return (
    <div className={cn(
      glass 
        ? 'glass-card' 
        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-md hover:border-primary-500/10 dark:hover:border-primary-500/10 transition-all duration-300', 
      'p-6', 
      className
    )}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
