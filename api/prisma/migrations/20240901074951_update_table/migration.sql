/*
  Warnings:

  - You are about to drop the column `order_groupd_id` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the `OrderGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupd_id` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_order_groupd_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderGroup" DROP CONSTRAINT "OrderGroup_created_by_id_fkey";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "order_groupd_id",
ADD COLUMN     "groupd_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OrderGroup";

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR,
    "name" VARCHAR NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "public_start_time" TIMESTAMP(3) NOT NULL,
    "public_end_time" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "share_scope" "ShareScope" DEFAULT 'PUBLIC',
    "type" "OrderGroupType" NOT NULL DEFAULT 'MANUAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupTemplate" (
    "id" SERIAL NOT NULL,
    "templateJson" JSONB NOT NULL,
    "created_by_id" INTEGER NOT NULL,

    CONSTRAINT "GroupTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_groupd_id_fkey" FOREIGN KEY ("groupd_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTemplate" ADD CONSTRAINT "GroupTemplate_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
