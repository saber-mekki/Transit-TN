import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useAppContext } from '../contexts/AppContext';
import { TransportType, Trip, Station, LouageTrip, BusTrip, TransporterTrip } from '../types';
import { BusIcon } from './icons/BusIcon';
import { useI18n } from '../hooks/useI18n';

// Informs TypeScript that 'L' is a global variable from the Leaflet CDN script
declare var L: any;

const haversineDistance = (
    coords1: { lat: number; lng: number },
    coords2: { lat: number; lng: number }
) => {
    const R = 6371e3; // metres
    const φ1 = (coords1.lat * Math.PI) / 180;
    const φ2 = (coords2.lat * Math.PI) / 180;
    const Δφ = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const Δλ = ((coords2.lng - coords1.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
};

export const LiveBusMap: React.FC = () => {
    const { trips, stations } = useAppContext();
    const { t } = useI18n();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<{ [key: string]: any }>({});

    // Create a map of all station locations for quick lookup
    const allStations = useMemo(() => Object.values(stations), [stations]);
    const stationByCityMap = useMemo(() => {
        const map = new Map<string, Station>();
        allStations.forEach(s => {
            if (!map.has(s.city)) {
                map.set(s.city, s);
            }
        });
        return map;
    }, [allStations]);
    
    const getTripEndpoints = useCallback((trip: Trip) => {
        let start: { lat: number, lng: number } | null = null;
        let end: { lat: number, lng: number } | null = null;
        
        switch(trip.type) {
            case TransportType.LOUAGE:
                start = (trip as LouageTrip).station?.location ?? stationByCityMap.get(trip.fromCity)?.location ?? null;
                end = stationByCityMap.get(trip.toCity)?.location ?? null;
                break;
            case TransportType.BUS:
                start = (trip as BusTrip).departureStation?.location ?? stationByCityMap.get(trip.fromCity)?.location ?? null;
                end = (trip as BusTrip).arrivalStation?.location ?? stationByCityMap.get(trip.toCity)?.location ?? null;
                break;
            case TransportType.TRANSPORTER:
                start = stationByCityMap.get(trip.fromCity)?.location ?? null;
                if (start) {
                    end = { lat: start.lat + 2.5, lng: start.lng + 1 };
                }
                break;
        }
        return { start, end };
    }, [stationByCityMap]);


    const tripsWithPaths = useMemo(() => {
        return trips
            .map(trip => {
                const { start, end } = getTripEndpoints(trip);
                if (!start || !end) return { trip, path: [] };

                let path = [start];
                if (trip.type === TransportType.TRANSPORTER && (trip as TransporterTrip).route) {
                    (trip as TransporterTrip).route?.forEach(city => {
                        const point = stationByCityMap.get(city)?.location;
                        if (point) {
                            path.push(point);
                        }
                    });
                }
                path.push(end);
                
                const uniquePath = path.filter((p, i) => i === 0 || p.lat !== path[i-1].lat || p.lng !== path[i-1].lng);

                return { trip, path: uniquePath };
            })
            .filter(item => item.path.length > 1);
    }, [trips, stationByCityMap, getTripEndpoints]);

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                scrollWheelZoom: true,
            }).setView([34.0, 9.5], 7);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }).addTo(map);

            mapInstanceRef.current = map;
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update vehicle markers
    useEffect(() => {
        const updatePositions = () => {
            if (!mapInstanceRef.current) return;
            const map = mapInstanceRef.current;
            
            const activeTripIds = new Set<string>();
            const now = new Date();

            tripsWithPaths.forEach(({ trip, path }) => {
                const departureTime = new Date(trip.departureTime);
                const arrivalTime = new Date(trip.arrivalTime);
                let totalDuration = arrivalTime.getTime() - departureTime.getTime();
                
                if (trip.type === TransportType.TRANSPORTER) {
                    totalDuration = 4 * 60 * 60 * 1000;
                }

                if (totalDuration <= 0) return;

                const timeSinceMidnight = now.getTime() - new Date(now).setHours(0, 0, 0, 0);
                const tripOffset = (trip.id.charCodeAt(1) || 0) * 30000;
                const timeProgress = ((timeSinceMidnight + tripOffset) % totalDuration) / totalDuration;
                
                const segmentDistances: number[] = [];
                let totalDistance = 0;
                for (let i = 0; i < path.length - 1; i++) {
                    const dist = haversineDistance(path[i], path[i+1]);
                    segmentDistances.push(dist);
                    totalDistance += dist;
                }

                if (totalDistance === 0) return;

                const distanceToTravel = totalDistance * timeProgress;
                let distanceCovered = 0;
                let currentLat, currentLng, angle;

                for (let i = 0; i < segmentDistances.length; i++) {
                    const segmentStart = path[i];
                    const segmentEnd = path[i + 1];
                    const segmentLength = segmentDistances[i];

                    if (distanceCovered + segmentLength >= distanceToTravel || i === segmentDistances.length - 1) {
                        const distanceIntoSegment = distanceToTravel - distanceCovered;
                        const segmentProgress = segmentLength === 0 ? 0 : distanceIntoSegment / segmentLength;

                        currentLat = segmentStart.lat + (segmentEnd.lat - segmentStart.lat) * segmentProgress;
                        currentLng = segmentStart.lng + (segmentEnd.lng - segmentStart.lng) * segmentProgress;
                        
                        const yRad = segmentEnd.lat - segmentStart.lat;
                        const xRad = segmentEnd.lng - segmentStart.lng;
                        angle = Math.atan2(yRad, xRad) * (180 / Math.PI);
                        break;
                    }
                    distanceCovered += segmentLength;
                }
                
                if (currentLat === undefined || currentLng === undefined) {
                    const lastPoint = path[path.length - 1];
                    currentLat = lastPoint.lat;
                    currentLng = lastPoint.lng;
                    angle = 0;
                }

                activeTripIds.add(trip.id);
                
                const iconHtml = ReactDOMServer.renderToString(
                    <BusIcon type={trip.type} className="w-6 h-6 text-indigo-600 drop-shadow-lg" />
                );

                const customIcon = L.divIcon({
                    html: `<div style="transform: rotate(${angle}deg); transition: transform 2s linear;">${iconHtml}</div>`,
                    className: 'leaflet-bus-icon',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                });

                let popupDetails = '';
                switch (trip.type) {
                    case TransportType.LOUAGE:
                    case TransportType.BUS:
                        popupDetails = `<p class="text-xs text-gray-500">${(trip as LouageTrip | BusTrip).availableSeats} ${t('seatsAvailable')}</p>`;
                        break;
                    case TransportType.TRANSPORTER:
                        popupDetails = `<p class="text-xs text-gray-500">${t('availableSpace')}: ${(trip as TransporterTrip).availableSpace}</p>`;
                        break;
                }
                
                const popupContent = `
                    <div class="p-1 font-sans">
                        <h4 class="font-bold text-indigo-700">${trip.operatorName}</h4>
                        <p class="text-sm text-gray-800">${trip.fromCity} → ${trip.toCity}</p>
                        ${popupDetails}
                    </div>
                `;

                if (markersRef.current[trip.id]) {
                    const marker = markersRef.current[trip.id];
                    marker.setLatLng([currentLat, currentLng]);
                    marker.setIcon(customIcon);
                    marker.getPopup().setContent(popupContent);
                } else {
                    const marker = L.marker([currentLat, currentLng], { icon: customIcon }).addTo(map);
                    marker.bindPopup(popupContent);
                    
                    marker.on('mouseover', function () { this.openPopup(); });
                    marker.on('mouseout', function () { this.closePopup(); });

                    markersRef.current[trip.id] = marker;
                }
            });
            
            Object.keys(markersRef.current).forEach(tripId => {
                if (!activeTripIds.has(tripId)) {
                    markersRef.current[tripId].remove();
                    delete markersRef.current[tripId];
                }
            });
        };

        const intervalId = setInterval(updatePositions, 2000);

        return () => clearInterval(intervalId);
    }, [tripsWithPaths, t]);

    return <div ref={mapContainerRef} className="w-full h-96 md:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg shadow-inner z-0" />;
};
