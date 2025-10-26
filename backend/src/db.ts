// FIX: Using a CJS-compatible import style for Prisma Client to resolve module resolution errors.
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default prisma;