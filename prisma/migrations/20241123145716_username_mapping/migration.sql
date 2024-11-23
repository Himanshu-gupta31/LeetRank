/*
  Warnings:

  - You are about to drop the column `userId` on the `Ranking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username,id]` on the table `Ranking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_userId_fkey";

-- DropIndex
DROP INDEX "Ranking_userId_id_key";

-- AlterTable
ALTER TABLE "Ranking" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_username_id_key" ON "Ranking"("username", "id");

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
