/*
  Warnings:

  - You are about to drop the `Curriculum` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Curriculum";

-- CreateTable
CREATE TABLE "curriculum" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,

    CONSTRAINT "curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_className_subjectName_topicName_key" ON "curriculum"("className", "subjectName", "topicName");
