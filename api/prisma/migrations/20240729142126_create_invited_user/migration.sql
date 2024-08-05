/*
  Warnings:

  - You are about to drop the `_Invited_order_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Invited_order_groups" DROP CONSTRAINT "_Invited_order_groups_A_fkey";

-- DropForeignKey
ALTER TABLE "_Invited_order_groups" DROP CONSTRAINT "_Invited_order_groups_B_fkey";

-- DropTable
DROP TABLE "_Invited_order_groups";

-- CreateTable
CREATE TABLE "InvitedUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderGroupId" INTEGER NOT NULL,

    CONSTRAINT "InvitedUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvitedUser" ADD CONSTRAINT "InvitedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitedUser" ADD CONSTRAINT "InvitedUser_orderGroupId_fkey" FOREIGN KEY ("orderGroupId") REFERENCES "OrderGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
