// FIX: Changed import to handle module resolution issues with Prisma Client.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;