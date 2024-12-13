-- CreateTable
CREATE TABLE "class6socialscience" (
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

    CONSTRAINT "class6socialscience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class6english" (
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

    CONSTRAINT "class6english_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class6hindi" (
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

    CONSTRAINT "class6hindi_pkey" PRIMARY KEY ("id")
);
