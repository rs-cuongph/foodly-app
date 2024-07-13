/*
  Warnings:

  - You are about to drop the `PaymentHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentLinkId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "paymentLinkId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PaymentHistory";

-- DropEnum
DROP TYPE "PaymentHistoryStatus";
