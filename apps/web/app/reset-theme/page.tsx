'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetThemePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Clear theme from localStorage
    localStorage.removeItem('theme');
    
    // Set dark as default
    localStorage.setItem('theme', 'dark');
    
    // Add dark class
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // Redirect to showcase
    setTimeout(() => {
      router.push('/showcase');
    }, 500);
  }, [router]);
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Resetting theme to dark mode...</h1>
        <p className="text-gray-400">Redirecting to showcase...</p>
      </div>
    </div>
  );
}
