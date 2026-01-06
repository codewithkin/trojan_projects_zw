-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'staff', 'support');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'user';
