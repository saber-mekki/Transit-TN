import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useI18n } from '../hooks/useI18n';
import type { Trip, LouageTrip, BusTrip, TransporterTrip } from '../types';
import { TransportType } from '../types';
import { AddTripForm } from './AddTripForm';
import { BusIcon } from './icons/BusIcon';

export const OperatorView: React.FC = () => {
    const { trips, updateTrip, currentUser, isLoading, error } = useAppContext();
    const { t } = useI18n();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

    if (!currentUser) {
        return null; // Should not happen if logic in App.tsx is correct
    }

    const operatorTrips = trips.filter(trip => trip.operatorId === currentUser.id);

    const handleUpdateSeats = (trip: Trip, updates: Partial<LouageTrip | BusTrip>) => {
        const updatedTrip = { ...trip, ...updates };
        updateTrip(updatedTrip as Trip);
    };

    const handleAddClick = () => {
        setTripToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleEditClick = (trip: Trip) => {
        setTripToEdit(trip);
        setIsFormModalOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormModalOpen(false);
        setTripToEdit(null);
    };

    const getTripKeyDetails = (trip: Trip) => {
        switch (trip.type) {
            case TransportType.LOUAGE:
                const louage = trip as LouageTrip;
                return {
                    label: t('station'),
                    value: louage.customStationName || louage.station?.name || 'N/A'
                };
            case TransportType.BUS:
                 const bus = trip as BusTrip;
                 return {
                     label: t('departure'),
                     value: bus.customDepartureStationName || bus.departureStation?.name || 'N/A'
                 };
            case TransportType.TRANSPORTER:
                 const transporter = trip as TransporterTrip;
                 return {
                     label: 'Vehicle Type',
                     value: transporter.vehicleType
                 };
            default:
                return null;
        }
    }

    return (
        <>
            <div className="p-4 md:p-6 mt-6">
                 <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('manageTrips')}</h2>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">{t('operatorViewSubtitle')}</p>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="mt-4 md:mt-0 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                        <i className="fas fa-plus mr-2 rtl:ml-2"></i>
                        {t('addTrip')}
                    </button>
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                             <p className="text-gray-500 dark:text-gray-400">Loading your trips...</p>
                        </div>
                    ) : error ? (
                         <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                             <p className="text-red-500">{error}</p>
                        </div>
                    ) : operatorTrips.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                             <p className="text-gray-500 dark:text-gray-400">{t('noResults')}</p>
                        </div>
                    ) : (
                        operatorTrips.map(trip => {
                             const keyDetails = getTripKeyDetails(trip);
                             return (
                            <div key={trip.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-lg">
                                {/* Card Header */}
                                <div className="p-4 border-b dark:border-gray-600 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <BusIcon type={trip.type} className="w-6 h-6 text-indigo-500" />
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{t(trip.type)}</span>
                                    </div>
                                    <button
                                        onClick={() => handleEditClick(trip)}
                                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-1 px-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm flex items-center"
                                    >
                                        <i className="fas fa-pencil-alt mr-2 rtl:ml-2 text-xs"></i>
                                        {t('edit')}
                                    </button>
                                </div>
                                
                                {/* Card Body */}
                                <div className="p-4">
                                    <p className="font-bold text-xl text-gray-900 dark:text-gray-100">{trip.fromCity} → {trip.toCity}</p>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                       <i className="far fa-clock mr-2 rtl:ml-2"></i>
                                       <span>{t('departure')}: {new Date(trip.departureTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                    </div>
                                    {keyDetails && (
                                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex items-center">
                                            <i className="fas fa-info-circle mr-2 rtl:ml-2"></i>
                                            <span className="font-semibold mr-1 rtl:ml-1">{keyDetails.label}:</span>
                                            <span>{keyDetails.value}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer (for actions) */}
                                {(trip.type === TransportType.LOUAGE || trip.type === TransportType.BUS) && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-600">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('availableSeatsLabel')}</label>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <input
                                                type="number"
                                                value={(trip as LouageTrip | BusTrip).availableSeats}
                                                onChange={(e) => {
                                                    const newSeats = parseInt(e.target.value) || 0;
                                                    const updates: Partial<LouageTrip | BusTrip> = { availableSeats: newSeats };
                                                    if (trip.type === TransportType.LOUAGE) {
                                                        (updates as Partial<LouageTrip>).isFull = newSeats === 0;
                                                    }
                                                    handleUpdateSeats(trip, updates);
                                                }}
                                                className="w-24 p-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                                                min="0"
                                                max={(trip as LouageTrip | BusTrip).totalSeats}
                                            />
                                            {trip.type === TransportType.LOUAGE && (
                                                <button
                                                    onClick={() => handleUpdateSeats(trip as LouageTrip, { isFull: !(trip as LouageTrip).isFull, availableSeats: (trip as LouageTrip).isFull ? (trip as LouageTrip).totalSeats : 0 })}
                                                    className={`px-4 py-2 rounded-md text-sm font-semibold text-white transition-colors w-40 text-center ${
                                                        (trip as LouageTrip).isFull 
                                                        ? 'bg-green-500 hover:bg-green-600' 
                                                        : 'bg-red-500 hover:bg-red-600'
                                                    }`}
                                                >
                                                    {(trip as LouageTrip).isFull ? t('markAsAvailable') : t('markAsFull')}
                                                </button>
                                            )}
                                             <span className="text-sm text-gray-500 dark:text-gray-400">
                                                / {(trip as LouageTrip | BusTrip).totalSeats} {t('seats')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )})
                    )}
                </div>
            </div>
            <AddTripForm 
                isOpen={isFormModalOpen}
                onClose={handleCloseForm}
                tripToEdit={tripToEdit}
            />
        </>
    );
};