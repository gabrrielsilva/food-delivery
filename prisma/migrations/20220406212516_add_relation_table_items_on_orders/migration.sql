/*
  Warnings:

  - You are about to drop the `_MenuItemToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MenuItemToOrder" DROP CONSTRAINT "_MenuItemToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuItemToOrder" DROP CONSTRAINT "_MenuItemToOrder_B_fkey";

-- DropTable
DROP TABLE "_MenuItemToOrder";

-- CreateTable
CREATE TABLE "ItemsOnOrders" (
    "orderId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ItemsOnOrders_pkey" PRIMARY KEY ("orderId","itemId")
);

-- AddForeignKey
ALTER TABLE "ItemsOnOrders" ADD CONSTRAINT "ItemsOnOrders_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOnOrders" ADD CONSTRAINT "ItemsOnOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
