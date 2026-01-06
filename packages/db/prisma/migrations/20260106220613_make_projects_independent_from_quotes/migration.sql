/*
  Warnings:

  - Added the required column `location` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_quoteId_fkey";

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "serviceId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "quoteId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "project_serviceId_idx" ON "project"("serviceId");

-- CreateIndex
CREATE INDEX "project_userId_idx" ON "project"("userId");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
