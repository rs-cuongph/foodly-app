/*
  Warnings:

  - A unique constraint covering the columns `[invite_code]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('INIT', 'LOCKED');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "invite_code" VARCHAR(100),
ADD COLUMN     "status" "GroupStatus" NOT NULL DEFAULT 'INIT';

-- CreateIndex
CREATE UNIQUE INDEX "Group_invite_code_key" ON "Group"("invite_code");
