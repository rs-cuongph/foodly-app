/*
  Warnings:

  - You are about to drop the column `currentChallenge` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebauthnChallenge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentChallenge",
ADD COLUMN     "current_challenge" TEXT;

-- DropTable
DROP TABLE "Authenticator";

-- DropTable
DROP TABLE "WebauthnChallenge";
