import React from 'react';
import { useI18n } from '../hooks/useI18n';

interface FooterProps {
  onAboutClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAboutClick }) => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full p-4 mt-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row justify-center items-center gap-x-4 gap-y-2 text-center">
        <span>© {currentYear} Transit TN</span>
        <span className="hidden md:inline">|</span>
        <div className="flex items-center gap-x-2">
            <i className="fab fa-whatsapp text-xs" aria-hidden="true"></i>
            <a href="https://wa.me/14915756380335" target="_blank" rel="noopener noreferrer" className="hover:underline">+14915756380335</a>
        </div>
        <span className="hidden md:inline">|</span>
        <span>
            {t('createdBy')}{' '}
            <button onClick={onAboutClick} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none">
                Digithage
            </button>
        </span>
      </div>
    </footer>
  );
};