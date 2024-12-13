/*
  Warnings:

  - You are about to drop the `class6english` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class6hindi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "class6english";

-- DropTable
DROP TABLE "class6hindi";

-- CreateTable
CREATE TABLE "class7science" (
    "id" SERIAL NOT NULL,
    "qno" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "optiona" TEXT NOT NULL,
    "optionb" TEXT NOT NULL,
    "optionc" TEXT NOT NULL,
    "optiond" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explaination" TEXT NOT NULL,
    "toughness" TEXT NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "class7science_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class7math" (
    "id" SERIAL NOT NULL,
    "qno" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "optiona" TEXT NOT NULL,
    "optionb" TEXT NOT NULL,
    "optionc" TEXT NOT NULL,
    "optiond" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explaination" TEXT NOT NULL,
    "toughness" TEXT NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "class7math_pkey" PRIMARY KEY ("id")
);
