import { Router } from 'express';
import prisma from '../db';
// FIX: Using a CJS-compatible import style for Prisma types to resolve module resolution errors.
import pkg from '@prisma/client';
const { UserRole } = pkg;

export const router = Router();

const normalizeUsername = (username: string): string => {
    if (!username) return '';
    const trimmedUsername = username.trim();

    // Normalize email to lowercase
    if (trimmedUsername.includes('@')) {
        return trimmedUsername.toLowerCase();
    }

    // For phone numbers, remove spaces before matching
    const phoneCandidate = trimmedUsername.replace(/\s/g, '');
    const phoneMatch = phoneCandidate.match(/^(?:\+216)?([24579]\d{7})$/);
    if (phoneMatch) {
        return phoneMatch[1];
    }
    
    // For all other usernames (like 'admin'), normalize to lowercase
    return trimmedUsername.toLowerCase();
};


// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { username, password, displayName, role } = req.body;

    if (!username || !password || !displayName || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Add validation for username format (must be email or phone)
    const trimmedUsername = username.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(trimmedUsername);
    
    const phoneCandidate = trimmedUsername.replace(/\s/g, '');
    const phoneMatch = phoneCandidate.match(/^(?:\+216)?([24579]\d{7})$/);
    const isPhone = !!phoneMatch;

    if (!isEmail && !isPhone) {
        return res.status(400).json({ message: 'Username must be a valid email or Tunisian phone number.' });
    }

    try {
        const normalizedUsername = normalizeUsername(username);

        const existingUser = await prisma.user.findUnique({
            where: { username: normalizedUsername },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        
        // In a real app, hash the password before saving!
        const newUser = await prisma.user.create({
            data: {
                username: normalizedUsername,
                password, // HASH THIS
                displayName,
                // FIX: Replaced 'UserRole' with 'typeof UserRole[keyof typeof UserRole]' to resolve TS2749.
                // This correctly gets the union type of enum values from the enum object.
                role: role.toUpperCase() as typeof UserRole[keyof typeof UserRole],
            },
        });
        
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ user: userWithoutPassword, token: newUser.id });

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
        const normalizedUsername = normalizeUsername(username);

        const user = await prisma.user.findUnique({
            where: { username: normalizedUsername },
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
        res.status(200).json({ user: userWithoutPassword, token: user.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// POST /api/auth/me - Verify token and get user data
router.post('/me', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // The token is the user's ID in this simple implementation
        const user = await prisma.user.findUnique({
            where: { id: token },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ message: 'Server error during token verification' });
    }
});