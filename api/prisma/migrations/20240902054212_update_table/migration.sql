/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "OrderOnTransaction" DROP CONSTRAINT "OrderOnTransaction_transaction_id_fkey";

-- AlterTable
ALTER TABLE "OrderOnTransaction" ALTER COLUMN "transaction_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transaction_id_seq";

-- AddForeignKey
ALTER TABLE "OrderOnTransaction" ADD CONSTRAINT "OrderOnTransaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
