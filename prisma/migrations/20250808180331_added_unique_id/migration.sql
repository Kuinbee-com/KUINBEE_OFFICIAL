/*
  Warnings:

  - A unique constraint covering the columns `[datasetUniqueId]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `datasetUniqueId` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "datasetUniqueId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_datasetUniqueId_key" ON "Dataset"("datasetUniqueId");
