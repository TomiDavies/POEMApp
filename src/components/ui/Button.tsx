'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500':
              variant === 'primary',
            'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400':
              variant === 'secondary',
            'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400':
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500':
              variant === 'danger',
          },
          {
            'text-xs px-2.5 py-1.5': size === 'sm',
            'text-sm px-3.5 py-2': size === 'md',
            'text-sm px-5 py-2.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
