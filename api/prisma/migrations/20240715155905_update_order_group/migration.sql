-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PROCESSING', 'INIT', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ShareScope" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "RequestAddCoinStatus" AS ENUM ('PROCESSING', 'INIT', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentHistoryStatus" AS ENUM ('PROCESSING', 'INIT', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderGroupType" AS ENUM ('MANUAL', 'AUTO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentRefreshToken" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "password" VARCHAR;

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderGroupId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PROCESSING',
    "payment" VARCHAR NOT NULL,
    "price" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "menu" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderGroup" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR NOT NULL,
    "createdById" INTEGER NOT NULL,
    "publicStartTime" TIMESTAMP(3) NOT NULL,
    "publicEndTime" TIMESTAMP(3) NOT NULL,
    "price" BIGINT NOT NULL,
    "shareScope" "ShareScope" NOT NULL DEFAULT 'PUBLIC',
    "inviteId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "OrderGroupType" NOT NULL DEFAULT 'MANUAL',

    CONSTRAINT "OrderGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderGroupTemplate" (
    "id" SERIAL NOT NULL,
    "templateJson" JSONB NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "OrderGroupTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "name" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "orderGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "id" SERIAL NOT NULL,
    "countOrderGroup" INTEGER NOT NULL,
    "countOrder" INTEGER NOT NULL,
    "monthYear" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestAddCoinHistories" (
    "id" SERIAL NOT NULL,
    "coin" INTEGER NOT NULL,
    "status" "RequestAddCoinStatus" NOT NULL DEFAULT 'INIT',
    "createdById" INTEGER NOT NULL,
    "approvedById" INTEGER NOT NULL,

    CONSTRAINT "RequestAddCoinHistories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" SERIAL NOT NULL,
    "amount" BIGINT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "bank_json" JSONB NOT NULL,
    "status" "PaymentHistoryStatus" NOT NULL DEFAULT 'INIT',

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderGroup_createdById_key" ON "OrderGroup"("createdById");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderGroup" ADD CONSTRAINT "OrderGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderGroupTemplate" ADD CONSTRAINT "OrderGroupTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_orderGroupId_fkey" FOREIGN KEY ("orderGroupId") REFERENCES "OrderGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAddCoinHistories" ADD CONSTRAINT "RequestAddCoinHistories_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAddCoinHistories" ADD CONSTRAINT "RequestAddCoinHistories_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
