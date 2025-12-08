import React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'small' | 'tiny' | 'lead';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'disabled';
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body',
  weight = 'normal',
  color = 'primary',
  as: Component = 'p',
  className = '', 
  children, 
  ...props 
}) => {
  const variants = {
    lead: 'text-xl',
    body: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs',
  };
  
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  
  const colors = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    tertiary: 'text-text-tertiary',
    disabled: 'text-text-disabled',
  };
  
  return (
    <Component 
      className={`${variants[variant]} ${weights[weight]} ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

Text.displayName = 'Text';
