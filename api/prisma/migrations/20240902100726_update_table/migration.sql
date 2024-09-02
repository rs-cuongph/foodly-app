-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_group_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "reason_cancel" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
