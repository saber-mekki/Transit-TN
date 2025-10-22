// FIX: Use a named import for PrismaClient
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;