/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,organization_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SHOP';

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "code" VARCHAR(16) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "payos_order_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_organization_id_key" ON "User"("email", "organization_id");
