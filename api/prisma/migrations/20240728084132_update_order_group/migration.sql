/*
  Warnings:

  - You are about to drop the column `createdById` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `inviteId` on the `OrderGroup` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `OrderGroup` table. All the data in the column will be lost.
  - Added the required column `name` to the `OrderGroup` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentHistoryStatus" AS ENUM ('PROCESSING', 'INIT', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderGroupType" AS ENUM ('MANUAL', 'AUTO');

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_createdById_fkey";

-- DropIndex
DROP INDEX "OrderGroup_createdById_key";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "createdById",
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "discount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderGroup" DROP COLUMN "inviteId",
DROP COLUMN "menuId",
ADD COLUMN     "name" VARCHAR NOT NULL,
ADD COLUMN     "type" "OrderGroupType" NOT NULL DEFAULT 'MANUAL',
ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "shareScope" DROP NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_Invited_order_groups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Invited_order_groups_AB_unique" ON "_Invited_order_groups"("A", "B");

-- CreateIndex
CREATE INDEX "_Invited_order_groups_B_index" ON "_Invited_order_groups"("B");

-- AddForeignKey
ALTER TABLE "_Invited_order_groups" ADD CONSTRAINT "_Invited_order_groups_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Invited_order_groups" ADD CONSTRAINT "_Invited_order_groups_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
