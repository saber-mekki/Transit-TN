import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { UsersPanel } from './admin/UsersPanel';
import { TripsPanel } from './admin/TripsPanel';
import { StationsPanel } from './admin/StationsPanel';

type AdminTab = 'users' | 'trips' | 'stations';

export const AdminDashboard: React.FC = () => {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    const tabs: { id: AdminTab; label: string; icon: string }[] = [
        { id: 'users', label: t('users'), icon: 'fa-users' },
        { id: 'trips', label: t('trips'), icon: 'fa-route' },
        { id: 'stations', label: t('stations'), icon: 'fa-map-signs' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'users': return <UsersPanel />;
            case 'trips': return <TripsPanel />;
            case 'stations': return <StationsPanel />;
            default: return null;
        }
    };
    
    return (
        <div className="p-4 md:p-6 text-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6">{t('adminPanel')}</h1>
            
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-4 font-semibold text-sm focus:outline-none transition-colors duration-200 ${
                            activeTab === tab.id
                                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <i className={`fas ${tab.icon} mr-2`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};
