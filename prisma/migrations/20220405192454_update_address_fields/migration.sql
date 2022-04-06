-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- DropIndex
DROP INDEX "User_addressId_key";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
