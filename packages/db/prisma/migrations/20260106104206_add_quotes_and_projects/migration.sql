-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('pending', 'starting', 'in_progress', 'waiting_for_review', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "quote" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'pending',
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "estimatedPrice" DECIMAL(10,2),
    "staffNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'pending',
    "finalPrice" DECIMAL(10,2),
    "scheduledDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "technicianName" TEXT,
    "technicianPhone" TEXT,
    "userRating" INTEGER,
    "userReview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quote_serviceId_idx" ON "quote"("serviceId");

-- CreateIndex
CREATE INDEX "quote_userId_idx" ON "quote"("userId");

-- CreateIndex
CREATE INDEX "quote_status_idx" ON "quote"("status");

-- CreateIndex
CREATE UNIQUE INDEX "project_quoteId_key" ON "project"("quoteId");

-- CreateIndex
CREATE INDEX "project_quoteId_idx" ON "project"("quoteId");

-- CreateIndex
CREATE INDEX "project_status_idx" ON "project"("status");

-- AddForeignKey
ALTER TABLE "quote" ADD CONSTRAINT "quote_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote" ADD CONSTRAINT "quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
