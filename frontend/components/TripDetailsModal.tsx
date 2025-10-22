import React from 'react';
import type { Trip, LouageTrip, BusTrip, TransporterTrip } from '../types';
import { TransportType } from '../types';
import { useI18n } from '../hooks/useI18n';
import { MapView } from './MapView';

interface TripDetailsModalProps {
  trip: Trip | null;
  onClose: () => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ trip, onClose }) => {
  const { t, language } = useI18n();

  if (!trip) return null;

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const renderContent = () => {
    const commonDetails = (
        <>
            <div className="mb-2">
                <span className="font-semibold">{t('operator')}: </span>{trip.operatorName}
            </div>
            <div className="mb-2">
                <span className="font-semibold">{t('departure')}: </span>{formatDateTime(trip.departureTime)}
            </div>
            <div className="mb-2">
                <span className="font-semibold">{t('arrival')}: </span>{formatDateTime(trip.arrivalTime)}
            </div>
        </>
    );

    switch (trip.type) {
        case TransportType.LOUAGE:
            const louage = trip as LouageTrip;
            const louageStationName = louage.customStationName || louage.station?.name;
            return <>
                {commonDetails}
                {louageStationName && <div className="mb-2"><span className="font-semibold">{t('station')}: </span>{louageStationName}</div>}
                {louage.vehicleNumber && (
                    <div className="mb-2"><span className="font-semibold">{t('vehicleNumber')}: </span>{louage.vehicleNumber}</div>
                )}
                {louage.contactInfo && (
                    <div className="mb-2">
                        <span className="font-semibold">{t('contact')}: </span>
                        <a href={`tel:${louage.contactInfo}`} className="text-blue-500 hover:underline">{louage.contactInfo}</a>
                    </div>
                )}
                <div className="mb-2"><span className="font-semibold">{t('price')}: </span>{louage.price} TND</div>
                <div className="mb-2"><span className="font-semibold">{t('seatsAvailable')}: </span>{louage.isFull ? t('full') : louage.availableSeats} / {louage.totalSeats}</div>
            </>;
        case TransportType.BUS:
            const bus = trip as BusTrip;
            const departureStationName = bus.customDepartureStationName || bus.departureStation?.name;
            const arrivalStationName = bus.customArrivalStationName || bus.arrivalStation?.name;
            return <>
                {commonDetails}
                {departureStationName && <div className="mb-2"><span className="font-semibold">{t('departure')}: </span>{departureStationName}</div>}
                {arrivalStationName && <div className="mb-2"><span className="font-semibold">{t('arrival')}: </span>{arrivalStationName}</div>}
                <div className="mb-2"><span className="font-semibold">{t('price')}: </span>{bus.price} TND</div>
                <div className="mb-2"><span className="font-semibold">{t('seatsAvailable')}: </span>{bus.availableSeats} / {bus.totalSeats}</div>
            </>;
        case TransportType.TRANSPORTER:
            const transporter = trip as TransporterTrip;
            return <>
                {commonDetails}
                <div className="mb-2"><span className="font-semibold">{t('contact')}: </span><a href={`tel:${transporter.contactInfo}`} className="text-blue-500 hover:underline">{transporter.contactInfo}</a></div>
                <div className="mb-2"><span className="font-semibold">{t('availableSpace')}: </span>{transporter.availableSpace}</div>
                <div className="mb-2"><span className="font-semibold">{t('eta')}: </span>{transporter.eta}</div>
                {transporter.route && transporter.route.length > 0 && (
                  <div className="mb-2"><span className="font-semibold">{t('route')}: </span>{transporter.route.join(' → ')}</div>
                )}
            </>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative text-gray-900 dark:text-gray-100" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">{t('tripDetails')}</h2>
        <h3 className="text-xl font-semibold mb-4">{trip.fromCity} → {trip.toCity}</h3>
        {renderContent()}
        <MapView trip={trip} />
      </div>
    </div>
  );
};
