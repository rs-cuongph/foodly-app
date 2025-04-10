-- AlterTable
ALTER TABLE "Authenticator" ADD COLUMN     "counter" INTEGER DEFAULT 0,
ADD COLUMN     "credentialPublicKey" TEXT;
