/*
  Warnings:

  - A unique constraint covering the columns `[username,collegeId]` on the table `Ranking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ranking_username_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_username_collegeId_key" ON "Ranking"("username", "collegeId");
