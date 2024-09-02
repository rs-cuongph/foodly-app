/*
  Warnings:

  - You are about to alter the column `code` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "code" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "short_name" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
