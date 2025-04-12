/*
  Warnings:

  - You are about to drop the `curriculum2` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[className,subjectName,topicName,subTopicName]` on the table `curriculum` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "curriculum_className_subjectName_topicName_key";

-- AlterTable
ALTER TABLE "curriculum" ADD COLUMN     "subTopicName" TEXT,
ALTER COLUMN "topicName" DROP NOT NULL;

-- DropTable
DROP TABLE "curriculum2";

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_className_subjectName_topicName_subTopicName_key" ON "curriculum"("className", "subjectName", "topicName", "subTopicName");
