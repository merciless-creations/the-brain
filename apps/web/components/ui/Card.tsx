import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, padding = 'md', className = '', children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    
    const hoverStyles = hover
      ? 'hover:-translate-y-0.5 hover:shadow-lg hover:border-border-strong cursor-pointer'
      : '';
    
    return (
      <div
        ref={ref}
        className={`bg-bg-secondary border border-border-subtle rounded-lg transition-all duration-200 ease-smooth ${paddingStyles[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
