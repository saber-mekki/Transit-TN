import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { DigithageLogo } from './icons/DigithageLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative text-gray-900 dark:text-gray-100" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
        
        <div className="flex flex-col items-center text-center">
            <DigithageLogo className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">{t('aboutDigithage')}</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">{t('digithageDescription')}</p>

            <div className="w-full text-left space-y-4 border-t pt-4 dark:border-gray-600">
                <div className="flex items-center">
                    <i className="fab fa-linkedin w-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-400"></i>
                    <a href="https://linkedin.com/company/digithage" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        linkedin.com/company/digithage
                    </a>
                </div>
                 <div className="flex items-center">
                    <i className="fas fa-phone-alt w-5 mr-3 rtl:mr-0 rtl:ml-3 text-gray-400"></i>
                    <a href="tel:+14915756380335" className="text-blue-500 hover:underline">
                        +14915756380335
                    </a>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="mt-6 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
                {t('close')}
            </button>
        </div>
      </div>
    </div>
  );
};