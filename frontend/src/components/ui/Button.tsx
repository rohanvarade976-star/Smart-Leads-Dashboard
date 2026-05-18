import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
  secondary: 'bg-surface-card dark:bg-surface-card-dark border border-surface-border dark:border-surface-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || isLoading}
    className={`
      inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
  >
    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : leftIcon}
    {children}
  </button>
);
