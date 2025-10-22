import React from 'react';
import { Logo } from './icons/Logo';

interface SplashScreenProps {
  isVisible: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
    </div>
  );
};