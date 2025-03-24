-- AlterTable
ALTER TABLE "User" ADD COLUMN     "login_code" VARCHAR(6),
ADD COLUMN     "login_code_expires_at" TIMESTAMP(3);
