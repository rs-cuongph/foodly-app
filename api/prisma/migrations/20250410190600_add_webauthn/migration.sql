/*
  Warnings:

  - The primary key for the `WebAuthnCredential` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `WebAuthnCredential` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WebAuthnCredential" DROP CONSTRAINT "WebAuthnCredential_pkey",
DROP COLUMN "id";
