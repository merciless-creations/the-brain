import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level, children, className = '', ...props }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const styles = {
    1: 'text-4xl font-bold text-text-primary tracking-tight',
    2: 'text-3xl font-bold text-text-primary tracking-tight',
    3: 'text-2xl font-semibold text-text-primary',
    4: 'text-xl font-semibold text-text-primary',
    5: 'text-lg font-semibold text-text-primary',
    6: 'text-base font-semibold text-text-primary',
  };
  
  return (
    <Tag className={`${styles[level]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

Heading.displayName = 'Heading';
