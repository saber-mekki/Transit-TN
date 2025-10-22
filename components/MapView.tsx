import React, { useMemo } from 'react';
// FIX: Import the `Station` type to correctly type station objects.
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
    // FIX: Explicitly type `allStations` to ensure correct type inference for array elements.
    const allStations: Station[] = Object.values(stations);

    switch (trip.type) {
      case TransportType.LOUAGE:
        if (trip.station?.location) {
          locations.push(trip.station.location);
        } else {
          const fallbackStation = allStations.find(s => s.city === trip.fromCity);
          if (fallbackStation) locations.push(fallbackStation.location);
        }
        break;
      case TransportType.BUS:
        if (trip.departureStation?.location) {
          locations.push(trip.departureStation.location);
        } else {
          const fallbackStation = allStations.find(s => s.city === trip.fromCity);
          if (fallbackStation) locations.push(fallbackStation.location);
        }
        if (trip.arrivalStation?.location) {
          locations.push(trip.arrivalStation.location);
        } else {
           const fallbackStation = allStations.find(s => s.city === trip.toCity);
           if (fallbackStation) locations.push(fallbackStation.location);
        }
        break;
      case TransportType.TRANSPORTER:
        const fromStation = allStations.find(s => s.city === trip.fromCity);
        if (fromStation) locations.push(fromStation.location);
        
        const toStation = allStations.find(s => trip.toCity.includes(s.city));
        if (toStation) locations.push(toStation.location);
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