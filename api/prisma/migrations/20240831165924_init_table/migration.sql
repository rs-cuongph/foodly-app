-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PROCESSING', 'INIT', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('INIT', 'PROCESSING', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ShareScope" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "RequestAddCoinStatus" AS ENUM ('PROCESSING', 'INIT', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentHistoryStatus" AS ENUM ('PROCESSING', 'INIT', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderGroupType" AS ENUM ('MANUAL', 'AUTO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "display_name" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "block_to" TIMESTAMP(3),
    "my_coin" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "payment_setting" JSONB,
    "max_order" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderGroup" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR,
    "name" VARCHAR NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "public_start_time" TIMESTAMP(3) NOT NULL,
    "public_end_time" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "share_scope" "ShareScope" DEFAULT 'PUBLIC',
    "type" "OrderGroupType" NOT NULL DEFAULT 'MANUAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "order_groupd_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PROCESSING',
    "payment" VARCHAR NOT NULL,
    "price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "menu" JSONB NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "OrderGroup" ADD CONSTRAINT "OrderGroup_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_order_groupd_id_fkey" FOREIGN KEY ("order_groupd_id") REFERENCES "OrderGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
