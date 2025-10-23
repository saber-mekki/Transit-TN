import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useI18n } from '../../hooks/useI18n';
import { Trip } from '../../types';
import { AddTripForm } from '../AddTripForm';
import { BusIcon } from '../icons/BusIcon';

export const TripsPanel: React.FC = () => {
    const { trips, deleteTrip } = useAppContext();
    const { t } = useI18n();

    const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleEditClick = (trip: Trip) => {
        setTripToEdit(trip);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (trip: Trip) => {
        setTripToDelete(trip);
    };

    const confirmDelete = () => {
        if (tripToDelete) {
            deleteTrip(tripToDelete.id);
            setTripToDelete(null);
        }
    };
    
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setTripToEdit(null);
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-bold p-4 border-b dark:border-gray-700">{t('manageTrips')}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">{t('operator')}</th>
                                <th scope="col" className="px-6 py-3">{t('route')}</th>
                                <th scope="col" className="px-6 py-3">{t('departure')}</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map(trip => (
                                <tr key={trip.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <BusIcon type={trip.type} className="w-5 h-5" />
                                            <span>{t(trip.type)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{trip.operatorName}</td>
                                    <td className="px-6 py-4">{trip.fromCity} → {trip.toCity}</td>
                                    <td className="px-6 py-4">{new Date(trip.departureTime).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => handleEditClick(trip)} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">{t('edit')}</button>
                                        <button onClick={() => handleDeleteClick(trip)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {tripToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">{t('deleteTripConfirmation')}</h3>
                        <p>{tripToDelete.operatorName}: {tripToDelete.fromCity} → {tripToDelete.toCity}</p>
                        <div className="flex justify-end mt-6 space-x-2">
                            <button onClick={() => setTripToDelete(null)} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
                            <button onClick={confirmDelete} className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">{t('delete')}</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Form Modal */}
            <AddTripForm 
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                tripToEdit={tripToEdit}
            />
        </>
    );
};
