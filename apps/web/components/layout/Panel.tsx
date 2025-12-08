'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PanelProps {
  children: React.ReactNode;
  side?: 'left' | 'right';
  defaultCollapsed?: boolean;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({ 
  children, 
  side = 'right',
  defaultCollapsed = false,
  className = '' 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  return (
    <div 
      className={`relative bg-bg-primary border-border transition-all duration-300 ${
        side === 'left' ? 'border-r' : 'border-l'
      } ${isCollapsed ? 'w-0 overflow-hidden' : 'w-80'} ${className}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-4 z-10 p-1.5 bg-bg-elevated border border-border rounded-md shadow-md hover:bg-bg-secondary transition-colors ${
          side === 'left' 
            ? 'right-[-16px]' 
            : 'left-[-16px]'
        }`}
      >
        {side === 'left' ? (
          isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
        ) : (
          isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
        )}
      </button>
      
      {/* Content */}
      <div className={`h-full overflow-y-auto p-4 ${isCollapsed ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

Panel.displayName = 'Panel';
