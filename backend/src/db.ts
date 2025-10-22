// FIX: Changed import to '.prisma/client' to resolve module export errors.
import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

export default prisma;