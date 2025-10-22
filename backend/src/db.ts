// FIX: Use a named import for PrismaClient
// Using a package import and destructuring to resolve module resolution issues.
import PrismaClientPackage from '@prisma/client';
const { PrismaClient } = PrismaClientPackage;

const prisma = new PrismaClient();

export default prisma;