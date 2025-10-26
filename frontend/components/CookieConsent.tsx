import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';

export const CookieConsent: React.FC = () => {
    const { t } = useI18n();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Use a timeout to delay the appearance slightly for a better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="p-4 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="w-0 flex-1 flex items-center">
                            <span className="flex p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                                <i className="fas fa-cookie-bite h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true"></i>
                            </span>
                            <p className="ml-3 rtl:mr-3 font-medium text-gray-900 dark:text-white">
                                <span className="md:hidden font-bold">{t('cookieConsentTitle')}</span>
                                <span className="hidden md:inline">{t('cookieConsentText')}</span>
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                             <button
                                onClick={handleDecline}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {t('decline')}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {t('accept')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
