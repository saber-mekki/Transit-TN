import { Router } from 'express';
import prisma from '../db';

export const router = Router();

// GET all stations
router.get('/', async (req, res) => {
    try {
        const stations = await prisma.station.findMany();
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stations' });
    }
});

// POST a new station
router.post('/', async (req, res) => {
    try {
        const { name, city, lat, lng } = req.body;
        const newStation = await prisma.station.create({
            data: { name, city, lat: parseFloat(lat), lng: parseFloat(lng) },
        });
        res.status(201).json(newStation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating station' });
    }
});

// PUT to update a station
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { name, city, lat, lng } = req.body;
        const updatedStation = await prisma.station.update({
            where: { id },
            data: { name, city, lat: parseFloat(lat), lng: parseFloat(lng) },
        });
        res.json(updatedStation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating station' });
    }
});

// DELETE a station
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.station.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting station' });
    }
});