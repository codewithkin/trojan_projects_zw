-- AlterEnum
ALTER TYPE "user_role" ADD VALUE 'admin';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT;
