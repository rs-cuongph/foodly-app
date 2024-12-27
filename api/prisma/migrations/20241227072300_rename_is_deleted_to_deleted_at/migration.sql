/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "is_deleted",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "note" VARCHAR(255);
