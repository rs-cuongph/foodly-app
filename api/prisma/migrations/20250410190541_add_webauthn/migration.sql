/*
  Warnings:

  - A unique constraint covering the columns `[credential_id]` on the table `WebAuthnCredential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credential_id` to the `WebAuthnCredential` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebAuthnCredential" ADD COLUMN     "counter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "credential_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WebAuthnCredential_credential_id_key" ON "WebAuthnCredential"("credential_id");
