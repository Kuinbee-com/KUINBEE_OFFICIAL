/*
  Warnings:

  - A unique constraint covering the columns `[aboutDatasetId]` on the table `DataFormatInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aboutDatasetId` to the `DataFormatInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AboutDatasetInfo" DROP CONSTRAINT "AboutDatasetInfo_dataFormatInfoId_fkey";

-- AlterTable
ALTER TABLE "DataFormatInfo" ADD COLUMN     "aboutDatasetId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DataFormatInfo_aboutDatasetId_key" ON "DataFormatInfo"("aboutDatasetId");

-- AddForeignKey
ALTER TABLE "DataFormatInfo" ADD CONSTRAINT "DataFormatInfo_aboutDatasetId_fkey" FOREIGN KEY ("aboutDatasetId") REFERENCES "AboutDatasetInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
