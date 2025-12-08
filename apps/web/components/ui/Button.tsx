import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    disabled,
    className = '',
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-accent-blue text-white hover:bg-accent-blue-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:ring-accent-blue',
      secondary: 'bg-bg-secondary text-text-primary border border-border hover:bg-bg-tertiary hover:border-border-strong focus-visible:ring-accent-blue',
      ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
      ai: 'bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:shadow-glow-blue hover:-translate-y-0.5 focus-visible:ring-accent-purple',
      danger: 'bg-accent-rose text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-accent-rose',
    };
    
    const sizes = {
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-base px-4 py-2 gap-2',
      lg: 'text-lg px-6 py-3 gap-2',
    };
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
