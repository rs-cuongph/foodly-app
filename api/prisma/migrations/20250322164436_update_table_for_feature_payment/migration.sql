/*
  Warnings:

  - You are about to drop the column `payos_order_code` on the `Transaction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SINGLE_ORDER', 'SETTLEMENT');

-- DropForeignKey
ALTER TABLE "OrderOnTransaction" DROP CONSTRAINT "OrderOnTransaction_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderOnTransaction" DROP CONSTRAINT "OrderOnTransaction_transaction_id_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "transaction_id" TEXT;

-- AlterTable
ALTER TABLE "OrderOnTransaction" ADD COLUMN     "amount" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "payos_order_code",
ADD COLUMN     "created_by_id" TEXT,
ADD COLUMN     "organization_id" TEXT,
ADD COLUMN     "qr_code" VARCHAR(20),
ADD COLUMN     "total_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "type" "TransactionType" NOT NULL DEFAULT 'SINGLE_ORDER',
ALTER COLUMN "metadata" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Order_transaction_id_idx" ON "Order"("transaction_id");

-- CreateIndex
CREATE INDEX "Transaction_created_by_id_idx" ON "Transaction"("created_by_id");

-- CreateIndex
CREATE INDEX "Transaction_organization_id_idx" ON "Transaction"("organization_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnTransaction" ADD CONSTRAINT "OrderOnTransaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnTransaction" ADD CONSTRAINT "OrderOnTransaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
