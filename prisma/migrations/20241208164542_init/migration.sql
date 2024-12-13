-- CreateTable
CREATE TABLE "class6science" (
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

    CONSTRAINT "class6science_pkey" PRIMARY KEY ("id")
);
