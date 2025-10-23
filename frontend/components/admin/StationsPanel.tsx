import React, { useState, FormEvent, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useI18n } from '../../hooks/useI18n';
import { Station } from '../../types';

const initialFormState: Omit<Station, 'id'> = {
    name: '',
    city: '',
    lat: 0,
    lng: 0,
};

export const StationsPanel: React.FC = () => {
    const { stations, addStation, updateStation, deleteStation, locations } = useAppContext();
    const { t } = useI18n();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stationToEdit, setStationToEdit] = useState<Station | null>(null);
    const [formData, setFormData] = useState<Omit<Station, 'id'>>(initialFormState);
    const [stationToDelete, setStationToDelete] = useState<Station | null>(null);

    const allStations = Object.values(stations);
    
    useEffect(() => {
        if (isModalOpen) {
            setFormData(stationToEdit ? { name: stationToEdit.name, city: stationToEdit.city, lat: stationToEdit.lat, lng: stationToEdit.lng } : initialFormState);
        }
    }, [isModalOpen, stationToEdit]);

    const handleOpenModal = (station?: Station) => {
        setStationToEdit(station || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setStationToEdit(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (stationToEdit) {
            updateStation({ id: stationToEdit.id, ...formData });
        } else {
            addStation(formData);
        }
        handleCloseModal();
    };

    const confirmDelete = () => {
        if (stationToDelete) {
            deleteStation(stationToDelete.id);
            setStationToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('manageStations')}</h2>
                    <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                        {t('addNew')}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('stationName')}</th>
                                <th scope="col" className="px-6 py-3">{t('stationCity')}</th>
                                <th scope="col" className="px-6 py-3">{t('latitude')}</th>
                                <th scope="col" className="px-6 py-3">{t('longitude')}</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allStations.map(station => (
                                <tr key={station.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{station.name}</td>
                                    <td className="px-6 py-4">{station.city}</td>
                                    <td className="px-6 py-4">{station.lat}</td>
                                    <td className="px-6 py-4">{station.lng}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => handleOpenModal(station)} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">{t('edit')}</button>
                                        <button onClick={() => setStationToDelete(station)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b dark:border-gray-700">
                                <h3 className="text-xl font-bold">{stationToEdit ? t('editStation') : t('addStation')}</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">{t('stationName')}</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">{t('stationCity')}</label>
                                     <select name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required>
                                        <option value="">Select a city</option>
                                        {locations.tunisianGovernorates.flatMap(g => g.delegations).sort().map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">{t('latitude')}</label>
                                    <input type="number" step="any" name="lat" value={formData.lat} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">{t('longitude')}</label>
                                    <input type="number" step="any" name="lng" value={formData.lng} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-2">
                                <button type="button" onClick={handleCloseModal} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
                                <button type="submit" className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{stationToEdit ? t('updateTrip') : t('addStation')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {stationToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">{t('deleteStationConfirmation')}</h3>
                        <p>Station: <span className="font-semibold">{stationToDelete.name}</span></p>
                        <div className="flex justify-end mt-6 space-x-2">
                            <button onClick={() => setStationToDelete(null)} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
                            <button onClick={confirmDelete} className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">{t('delete')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
