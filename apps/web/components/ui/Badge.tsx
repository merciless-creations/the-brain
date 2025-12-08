import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'gray';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'blue', 
  size = 'md',
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  
  const variants = {
    blue: 'bg-accent-blue/10 text-accent-blue',
    purple: 'bg-accent-purple/10 text-accent-purple',
    emerald: 'bg-accent-emerald/10 text-accent-emerald',
    amber: 'bg-accent-amber/10 text-accent-amber',
    rose: 'bg-accent-rose/10 text-accent-rose',
    cyan: 'bg-accent-cyan/10 text-accent-cyan',
    gray: 'bg-bg-tertiary text-text-secondary',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };
  
  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
