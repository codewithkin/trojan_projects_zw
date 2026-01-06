-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('solar', 'cctv', 'electrical', 'water', 'welding');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "user_preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interests" TEXT[],
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "priceRange" TEXT,
    "category" "ServiceCategory" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "brands" TEXT[],
    "supports" TEXT[],
    "specifications" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_rating" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_like" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_request" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'pending',
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "estimatedPrice" DECIMAL(10,2),
    "finalPrice" DECIMAL(10,2),
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "technicianName" TEXT,
    "technicianPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_userId_key" ON "user_preference"("userId");

-- CreateIndex
CREATE INDEX "user_preference_userId_idx" ON "user_preference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "service_slug_key" ON "service"("slug");

-- CreateIndex
CREATE INDEX "service_category_idx" ON "service"("category");

-- CreateIndex
CREATE INDEX "service_featured_idx" ON "service"("featured");

-- CreateIndex
CREATE INDEX "service_rating_serviceId_idx" ON "service_rating"("serviceId");

-- CreateIndex
CREATE INDEX "service_rating_userId_idx" ON "service_rating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "service_rating_serviceId_userId_key" ON "service_rating"("serviceId", "userId");

-- CreateIndex
CREATE INDEX "service_like_serviceId_idx" ON "service_like"("serviceId");

-- CreateIndex
CREATE INDEX "service_like_userId_idx" ON "service_like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "service_like_serviceId_userId_key" ON "service_like"("serviceId", "userId");

-- CreateIndex
CREATE INDEX "service_request_serviceId_idx" ON "service_request"("serviceId");

-- CreateIndex
CREATE INDEX "service_request_userId_idx" ON "service_request"("userId");

-- CreateIndex
CREATE INDEX "service_request_status_idx" ON "service_request"("status");

-- AddForeignKey
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_rating" ADD CONSTRAINT "service_rating_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_rating" ADD CONSTRAINT "service_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_like" ADD CONSTRAINT "service_like_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_like" ADD CONSTRAINT "service_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
