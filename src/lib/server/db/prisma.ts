import { PrismaClient } from "@prisma/client";

const prismaClient = global.__prisma || new PrismaClient({});

global.__prisma = prismaClient;

export { prismaClient };
