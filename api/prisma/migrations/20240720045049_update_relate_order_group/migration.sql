/*
  Warnings:

  - You are about to drop the column `createdById` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `OrderGroup` table. All the data in the column will be lost.
  - Added the required column `name` to the `OrderGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_createdById_fkey";

-- DropIndex
DROP INDEX "OrderGroup_createdById_key";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "createdById",
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "discount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderGroup" DROP COLUMN "menuId",
ADD COLUMN     "name" VARCHAR NOT NULL,
ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "shareScope" DROP NOT NULL,
ALTER COLUMN "inviteId" DROP NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL;
