'use client';

import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-bg-elevated border border-border-strong shadow-xl',
          title: 'text-text-primary font-medium',
          description: 'text-text-secondary',
          actionButton: 'bg-accent-blue text-white',
          cancelButton: 'bg-bg-secondary text-text-primary',
          closeButton: 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary',
        },
      }}
      richColors
    />
  );
};
