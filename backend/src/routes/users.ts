import { Router } from 'express';
import prisma from '../db';
import { UserRole } from '@prisma/client';

export const router = Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, displayName: true, role: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// PUT /api/users/:id - Update a user's role
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(UserRole).includes(role.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid role provided' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role: role.toUpperCase() as UserRole },
            select: { id: true, username: true, displayName: true, role: true }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // A real app would get the current user from a token
        // Here we'll just add a safeguard so the seed admin isn't easily deleted
        const userToDelete = await prisma.user.findUnique({ where: { id }});
        if (userToDelete?.username === 'admin') {
            return res.status(403).json({ message: "Cannot delete the primary admin account." });
        }

        await prisma.user.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});