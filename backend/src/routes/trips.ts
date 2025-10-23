import { Router } from 'express';
import prisma from '../db';
// FIX: Changed import to handle module resolution issues with Prisma Client.
import { TransportType } from '@prisma/client';

export const router = Router();

// GET all trips
router.get('/', async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            include: {
                louageTrip: { include: { station: true } },
                busTrip: { include: { departureStation: true, arrivalStation: true } },
                transporterTrip: true,
            },
            orderBy: {
                departureTime: 'asc',
            }
        });

        // Flatten the data to match the frontend type structure
        const formattedTrips = trips.map((trip) => {
            let specificTripData = {};
            if (trip.type === 'LOUAGE' && trip.louageTrip) {
                specificTripData = { ...trip.louageTrip };
            } else if (trip.type === 'BUS' && trip.busTrip) {
                specificTripData = { ...trip.busTrip };
            } else if (trip.type === 'TRANSPORTER' && trip.transporterTrip) {
                specificTripData = { ...trip.transporterTrip };
            }
            const { louageTrip, busTrip, transporterTrip, ...commonTripData } = trip;
            return { ...commonTripData, type: commonTripData.type.toLowerCase(), ...specificTripData };
        });

        res.json(formattedTrips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching trips' });
    }
});

// POST a new trip
router.post('/', async (req, res) => {
    try {
        const { type, operatorId, ...tripData } = req.body;
        const operator = await prisma.user.findUnique({ where: { id: operatorId } });
        if (!operator) {
            return res.status(404).json({ message: 'Operator not found' });
        }
        
        let newTrip;
        const tripType = type.toUpperCase() as TransportType;

        if (tripType === TransportType.LOUAGE) {
            const { price, totalSeats, stationId, customStationName, vehicleNumber, contactInfo } = tripData;
            newTrip = await prisma.trip.create({
                data: {
                    type: TransportType.LOUAGE, operatorId, operatorName: operator.displayName, fromCity: tripData.fromCity, toCity: tripData.toCity,
                    departureTime: tripData.departureTime, arrivalTime: tripData.arrivalTime,
                    louageTrip: { create: { price, totalSeats, availableSeats: totalSeats, isFull: false, stationId, customStationName, vehicleNumber, contactInfo } }
                }
            });
        } else if (tripType === TransportType.BUS) {
            const { price, totalSeats, departureStationId, arrivalStationId, customDepartureStationName, customArrivalStationName } = tripData;
            newTrip = await prisma.trip.create({
                data: {
                    type: TransportType.BUS, operatorId, operatorName: operator.displayName, fromCity: tripData.fromCity, toCity: tripData.toCity,
                    departureTime: tripData.departureTime, arrivalTime: tripData.arrivalTime,
                    busTrip: { create: { price, totalSeats, availableSeats: totalSeats, departureStationId, arrivalStationId, customDepartureStationName, customArrivalStationName } }
                }
            });
        } else if (tripType === TransportType.TRANSPORTER) {
             const { contactInfo, vehicleType, availableSpace, eta, route } = tripData;
             newTrip = await prisma.trip.create({
                 data: {
                    type: TransportType.TRANSPORTER, operatorId, operatorName: operator.displayName, fromCity: tripData.fromCity, toCity: tripData.toCity,
                    departureTime: tripData.departureTime, arrivalTime: tripData.arrivalTime,
                    transporterTrip: { create: { contactInfo, vehicleType, availableSpace, eta, route } }
                 }
             })
        } else {
            return res.status(400).json({ message: "Invalid trip type" });
        }
        
        res.status(201).json(newTrip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating trip' });
    }
});


// PUT to update a trip
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { type, ...updates } = req.body;
    try {
        let updatedTrip;
        const tripType = type.toLowerCase();

        if (tripType === TransportType.LOUAGE.toLowerCase()) {
            const { price, totalSeats, availableSeats, isFull, stationId, customStationName, vehicleNumber, contactInfo, ...commonUpdates } = updates;
            delete commonUpdates.louageTrip; // Remove nested object from common updates
            updatedTrip = await prisma.trip.update({
                where: { id },
                data: { ...commonUpdates, louageTrip: { update: { price, totalSeats, availableSeats, isFull, stationId, customStationName, vehicleNumber, contactInfo } } },
            });
        } else if (tripType === TransportType.BUS.toLowerCase()) {
            const { price, totalSeats, availableSeats, departureStationId, arrivalStationId, customDepartureStationName, customArrivalStationName, ...commonUpdates } = updates;
            delete commonUpdates.busTrip;
            updatedTrip = await prisma.trip.update({
                where: { id },
                data: { ...commonUpdates, busTrip: { update: { price, totalSeats, availableSeats, departureStationId, arrivalStationId, customDepartureStationName, customArrivalStationName } } },
            });
        } else if (tripType === TransportType.TRANSPORTER.toLowerCase()) {
            const { contactInfo, vehicleType, availableSpace, eta, route, ...commonUpdates } = updates;
            delete commonUpdates.transporterTrip;
            updatedTrip = await prisma.trip.update({
                where: { id },
                data: { ...commonUpdates, transporterTrip: { update: { contactInfo, vehicleType, availableSpace, eta, route } } },
            });
        } else {
             return res.status(400).json({ message: "Invalid trip type" });
        }
        res.json(updatedTrip);
    } catch (error) {
         console.error(error);
        res.status(500).json({ message: 'Error updating trip' });
    }
});

// DELETE a trip
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Use a transaction to ensure all related data is deleted
        await prisma.$transaction(async (prisma) => {
            // Delete trip-specific data first
            await prisma.louageTrip.deleteMany({ where: { tripId: id } });
            await prisma.busTrip.deleteMany({ where: { tripId: id } });
            await prisma.transporterTrip.deleteMany({ where: { tripId: id } });

            // Then delete the main trip record
            await prisma.trip.delete({ where: { id } });
        });

        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete trip:", error);
        res.status(500).json({ message: "Error deleting trip" });
    }
});