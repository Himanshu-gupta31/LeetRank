/*
  Warnings:

  - You are about to drop the column `easyques` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `hardques` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `mediumques` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `totalques` on the `Ranking` table. All the data in the column will be lost.
  - Added the required column `collegeId` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ranking" DROP COLUMN "easyques",
DROP COLUMN "hardques",
DROP COLUMN "mediumques",
DROP COLUMN "totalques",
ADD COLUMN     "collegeId" TEXT NOT NULL,
ADD COLUMN     "score" INTEGER;

-- CreateIndex
CREATE INDEX "Ranking_collegeId_score_idx" ON "Ranking"("collegeId", "score" DESC);

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
