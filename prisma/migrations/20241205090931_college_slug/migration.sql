/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `College` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "College" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");
