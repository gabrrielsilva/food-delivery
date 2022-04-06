/*
  Warnings:

  - You are about to drop the `UserAdmin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserAdmin";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuItemToOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuItemToOrder_AB_unique" ON "_MenuItemToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuItemToOrder_B_index" ON "_MenuItemToOrder"("B");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToOrder" ADD FOREIGN KEY ("A") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToOrder" ADD FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
