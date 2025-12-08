'use client';

import React from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { Button } from '../ui';

export interface HeaderProps {
  title?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, className = '' }) => {
  const [isDark, setIsDark] = React.useState(true);
  
  React.useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme');
    const isDarkMode = !theme || theme === 'dark';
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };
  
  return (
    <header className={`h-16 bg-bg-elevated border-b border-border flex items-center justify-between px-6 ${className}`}>
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="!p-2"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="!p-2"
        >
          <User size={18} />
        </Button>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
