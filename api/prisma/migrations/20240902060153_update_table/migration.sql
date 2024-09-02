/*
  Warnings:

  - Added the required column `group_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderOnTransaction" DROP CONSTRAINT "OrderOnTransaction_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderOnTransaction" DROP CONSTRAINT "OrderOnTransaction_transaction_id_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "group_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnTransaction" ADD CONSTRAINT "OrderOnTransaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnTransaction" ADD CONSTRAINT "OrderOnTransaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
