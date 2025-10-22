import { Router } from 'express';
import prisma from '../db';

const router = Router();

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

export default router;