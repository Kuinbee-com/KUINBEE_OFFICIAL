import { prisma } from "../../client/prisma/getPrismaClient";

const dropTables = async () => {
    try {
        await prisma.$executeRaw`DROP TABLE IF EXISTS "Dataset" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "AboutDatasetInfo" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "Feature" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "DataFormatInfo" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "LocationInfo" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "DatasetLocationInfo" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "DatasetSecurityInfo" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "DatasetBirthInfo" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "DatasetUpdateHistory" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "DatasetLookup" CASCADE`;
        await prisma.$executeRaw`DROP TABLE IF EXISTS "CategoryLookup" CASCADE`;

        console.log("All tables dropped successfully.");
    } catch (error) {
        console.error("Error dropping tables:", error);
    }
};


async () => {
    await dropTables();
};