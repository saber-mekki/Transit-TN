
// FIX: Use a named import for PrismaClient.
import * as Prisma from '@prisma/client';

const prisma = new Prisma.PrismaClient();

export default prisma;
