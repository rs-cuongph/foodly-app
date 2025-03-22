/*
  Warnings:

  - You are about to drop the column `qr_code` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unique_code]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unique_code` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "qr_code",
ADD COLUMN     "unique_code" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_unique_code_key" ON "Transaction"("unique_code");
