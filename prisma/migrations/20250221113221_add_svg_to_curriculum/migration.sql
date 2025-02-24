/*
  Warnings:

  - A unique constraint covering the columns `[className,subjectName]` on the table `curriculum` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "curriculum_className_subjectName_topicName_key";

-- AlterTable
ALTER TABLE "curriculum" ADD COLUMN     "svg" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_className_subjectName_key" ON "curriculum"("className", "subjectName");
