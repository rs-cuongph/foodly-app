/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `myCoin` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxOrderNotPay` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "myCoin" SET NOT NULL,
ALTER COLUMN "myCoin" SET DEFAULT 0,
ALTER COLUMN "maxOrderNotPay" SET NOT NULL;
