/*
  Warnings:

  - You are about to drop the column `groupd_id` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_groupd_id_fkey";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "groupd_id",
ADD COLUMN     "group_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
