'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface ThreeColumnLayoutProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  title?: string;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  children,
  leftPanel,
  rightPanel,
  title,
}) => {
  return (
    <div className="flex h-screen bg-bg-app">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel (Optional) */}
          {leftPanel}
          
          {/* Center Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          
          {/* Right Panel (Optional) */}
          {rightPanel}
        </div>
      </div>
    </div>
  );
};

ThreeColumnLayout.displayName = 'ThreeColumnLayout';
