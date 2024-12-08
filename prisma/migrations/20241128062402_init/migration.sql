/*
  Warnings:

  - You are about to drop the `QuizQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "QuizQuestions";

-- CreateTable
CREATE TABLE "class6math" (
    "id" SERIAL NOT NULL,
    "qno" BIGINT NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explaination" TEXT NOT NULL,
    "toughness" TEXT NOT NULL,

    CONSTRAINT "class6math_pkey" PRIMARY KEY ("id")
);
