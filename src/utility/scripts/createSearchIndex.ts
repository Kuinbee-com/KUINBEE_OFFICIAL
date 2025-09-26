import { prisma } from "../../client/prisma/getPrismaClient";

const createDatasetIndexes = async () => {
    try {
        await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_dataset_sourceId ON "Dataset" ("sourceId")`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_dataset_primaryCategoryId ON "Dataset" ("primaryCategoryId")`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_dataset_superType ON "Dataset" ("superType")`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_dataset_isPaid ON "Dataset" ("isPaid")`;
        await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_dataset_uploaded ON "Dataset" ("uploaded")`;

        await prisma.$executeRaw`
  CREATE INDEX IF NOT EXISTS idx_dataset_composite
  ON "Dataset" ("sourceId", "primaryCategoryId", "superType", "isPaid", "uploaded")
`;

        await prisma.$executeRaw`
  CREATE INDEX IF NOT EXISTS dataset_title_trgm_idx
  ON "Dataset" USING gin ("title" gin_trgm_ops)
`;
        console.log("All Dataset indexes created successfully.");
    } catch (error) {
        console.error("Error creating Dataset indexes:", error);
    }
};

(async () => {
    await createDatasetIndexes();
})();