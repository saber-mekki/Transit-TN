import React from 'react';
import type { Trip, LouageTrip, BusTrip, TransporterTrip } from '../types';
import { TransportType } from '../types';
import { useI18n } from '../hooks/useI18n';
import { MapPinIcon } from './icons/MapPinIcon';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

const formatTime = (isoString: string, lang: 'ar' | 'fr' | 'en') => {
    return new Date(isoString).toLocaleTimeString(lang === 'ar' ? 'ar-TN' : `fr-FR`, { hour: '2-digit', minute: '2-digit' });
};

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect }) => {
  const { t, language } = useI18n();

  const renderTripSpecifics = () => {
    switch (trip.type) {
      case TransportType.LOUAGE:
        const louage = trip as LouageTrip;
        const louageStationName = louage.customStationName || louage.station?.name;
        return (
          <>
            <div>
              {louageStationName && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{louageStationName}</span>
                </div>
              )}
              {louage.contactInfo && (
                 <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <i className="fas fa-phone-alt w-4 h-4 mr-2 text-gray-400"></i>
                    <a href={`tel:${louage.contactInfo}`} className="text-blue-500 hover:underline">{louage.contactInfo}</a>
                </div>
              )}
            </div>
            <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {louage.isFull ? (
                <span className="text-red-500">{t('full')}</span>
              ) : (
                `${louage.availableSeats} ${t('seatsAvailable')}`
              )}
            </div>
            <div className="text-sm text-gray-500">{t('approxPrice')}: {louage.price} TND</div>
          </>
        );
      case TransportType.BUS:
        const bus = trip as BusTrip;
        const departureStationName = bus.customDepartureStationName || bus.departureStation?.name;
        return (
          <>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
                {departureStationName}
            </div>
             <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                {`${bus.availableSeats} ${t('seats')}`}
            </div>
            <div className="text-sm text-gray-500">{bus.price} TND</div>
          </>
        );
      case TransportType.TRANSPORTER:
        const transporter = trip as TransporterTrip;
        return (
          <>
            <div className="text-gray-600 dark:text-gray-300 text-sm">{transporter.vehicleType}</div>
            <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                {transporter.availableSpace}
            </div>
             <div className="text-sm text-gray-500">{t('eta')}: {transporter.eta}</div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={() => onSelect(trip)}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{trip.operatorName}</p>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{trip.fromCity} → {trip.toCity}</h3>
        </div>
        <div className="text-right">
            <p className="text-xl font-mono font-bold text-gray-900 dark:text-gray-100">{formatTime(trip.departureTime, language)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('departure')}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        {renderTripSpecifics()}
      </div>
    </div>
  );
};
