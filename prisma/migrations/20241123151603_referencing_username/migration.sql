-- DropForeignKey
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_username_fkey";

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
