-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GroupStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "GroupStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "GroupStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reset_password_token" TEXT,
ADD COLUMN     "reset_password_token_expires_at" TIMESTAMP(3);
