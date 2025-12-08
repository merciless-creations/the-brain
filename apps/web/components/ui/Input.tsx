import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-bg-input border rounded-md text-text-primary placeholder:text-text-tertiary transition-all duration-200 ease-smooth hover:border-border-strong focus:border-accent-blue focus:outline-none focus:ring-4 focus:ring-accent-blue/10 ${
            error ? 'border-accent-rose focus:border-accent-rose focus:ring-accent-rose/10' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-accent-rose">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-text-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
