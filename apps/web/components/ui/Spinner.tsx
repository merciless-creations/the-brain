import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };
  
  return (
    <Loader2 
      className={`animate-spin text-accent-blue ${className}`} 
      size={sizes[size]} 
    />
  );
};

Spinner.displayName = 'Spinner';
