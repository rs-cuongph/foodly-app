/*
  Warnings:

  - You are about to drop the column `credential` on the `WebAuthnCredential` table. All the data in the column will be lost.
  - Added the required column `credentialJson` to the `WebAuthnCredential` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebAuthnCredential" DROP COLUMN "credential",
ADD COLUMN     "credentialJson" JSONB NOT NULL;
