import React, { useMemo } from 'react';
import type { Trip, Station } from '../types';
import { TransportType } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface MapViewProps {
  trip: Trip;
}

export const MapView: React.FC<MapViewProps> = ({ trip }) => {
  const { stations } = useAppContext();

  const mapUrl = useMemo(() => {
    const locations: { lat: number; lng: number }[] = [];
    const allStations: Station[] = Object.values(stations);

    switch (trip.type) {
      case TransportType.LOUAGE:
        if (trip.station?.lat && trip.station?.lng) {
          locations.push({ lat: trip.station.lat, lng: trip.station.lng });
        } else {
          const fallbackStation = allStations.find(s => s.city === trip.fromCity);
          if (fallbackStation) locations.push({ lat: fallbackStation.lat, lng: fallbackStation.lng });
        }
        break;
      case TransportType.BUS:
        if (trip.departureStation?.lat && trip.departureStation?.lng) {
          locations.push({ lat: trip.departureStation.lat, lng: trip.departureStation.lng });
        } else {
          const fallbackStation = allStations.find(s => s.city === trip.fromCity);
          if (fallbackStation) locations.push({ lat: fallbackStation.lat, lng: fallbackStation.lng });
        }
        if (trip.arrivalStation?.lat && trip.arrivalStation?.lng) {
          locations.push({ lat: trip.arrivalStation.lat, lng: trip.arrivalStation.lng });
        } else {
           const fallbackStation = allStations.find(s => s.city === trip.toCity);
           if (fallbackStation) locations.push({ lat: fallbackStation.lat, lng: fallbackStation.lng });
        }
        break;
      case TransportType.TRANSPORTER:
        const fromStation = allStations.find(s => s.city === trip.fromCity);
        if (fromStation) locations.push({ lat: fromStation.lat, lng: fromStation.lng });
        
        const toCityGuess = trip.toCity.split(',')[0];
        const toStation = allStations.find(s => toCityGuess.includes(s.city));
        if (toStation) locations.push({ lat: toStation.lat, lng: toStation.lng });
        break;
    }

    if (locations.length === 0) {
      return null;
    }

    const lats = locations.map(loc => loc.lat);
    const lngs = locations.map(loc => loc.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latPadding = (maxLat - minLat) * 0.2 || 0.05;
    const lngPadding = (maxLng - minLng) * 0.2 || 0.05;

    const bbox = [
      minLng - lngPadding,
      minLat - latPadding,
      maxLng + lngPadding,
      maxLat + latPadding,
    ].join(',');

    const markers = locations
      .map(loc => `marker=${loc.lat},${loc.lng}`)
      .join('&');

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&${markers}`;
  }, [trip, stations]);

  if (!mapUrl) {
    return (
      <div className="mt-4 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map view unavailable for this trip.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
      <iframe
        className="dark:filter dark:invert-[1] dark:hue-rotate-180 dark:contrast-75"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title={`Map of trip from ${trip.fromCity} to ${trip.toCity}`}
      ></iframe>
    </div>
  );
};