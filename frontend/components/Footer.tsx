import React from 'react';
import { useI18n } from '../hooks/useI18n';

interface FooterProps {
  onAboutClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAboutClick }) => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center p-4 mt-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      © {currentYear} Transit TN. {t('createdBy')}{' '}
      <button onClick={onAboutClick} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none">
        Digithage
      </button>
    </footer>
  );
};
