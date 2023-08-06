import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();
// This prevents initialising many prismadb instances due to Next13's hot reloading
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
