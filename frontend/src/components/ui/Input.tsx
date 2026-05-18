import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    )}
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{leftIcon}</span>
      )}
      <input
        ref={ref}
        {...props}
        className={`
          w-full rounded-lg border bg-white dark:bg-surface-card-dark
          text-slate-900 dark:text-slate-100
          border-surface-border dark:border-surface-border-dark
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
          transition-colors text-sm py-2
          ${leftIcon ? 'pl-9 pr-3' : 'px-3'}
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${className}
        `}
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', children, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    )}
    <select
      ref={ref}
      {...props}
      className={`
        w-full rounded-lg border bg-white dark:bg-surface-card-dark
        text-slate-900 dark:text-slate-100
        border-surface-border dark:border-surface-border-dark
        focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
        transition-colors text-sm px-3 py-2
        ${error ? 'border-red-400' : ''}
        ${className}
      `}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    )}
    <textarea
      ref={ref}
      {...props}
      className={`
        w-full rounded-lg border bg-white dark:bg-surface-card-dark
        text-slate-900 dark:text-slate-100
        border-surface-border dark:border-surface-border-dark
        placeholder-slate-400 dark:placeholder-slate-500
        focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
        transition-colors text-sm px-3 py-2 resize-none
        ${error ? 'border-red-400' : ''}
        ${className}
      `}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';
