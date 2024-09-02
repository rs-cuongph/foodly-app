/*
  Warnings:

  - The `type` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('MANUAL', 'AUTO');

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "type",
ADD COLUMN     "type" "GroupType" NOT NULL DEFAULT 'MANUAL';

-- DropEnum
DROP TYPE "OrderGroupType";
