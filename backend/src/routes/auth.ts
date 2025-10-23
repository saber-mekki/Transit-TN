import { Router } from 'express';
import prisma from '../db';
// FIX: Changed import to handle module resolution issues with Prisma Client.
import { UserRole } from '@prisma/client';

export const router = Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { username, password, displayName, role } = req.body;

    if (!username || !password || !displayName || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        
        // In a real app, hash the password before saving!
        const newUser = await prisma.user.create({
            data: {
                username,
                password, // HASH THIS
                displayName,
                role: role.toUpperCase() as UserRole,
            },
        });
        
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // In a real app, compare hashed passwords!
        const isPasswordValid = user.password === password;

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});