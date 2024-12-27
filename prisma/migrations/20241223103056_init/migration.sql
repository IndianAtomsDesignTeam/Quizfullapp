-- CreateTable
CREATE TABLE "class6math" (
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

    CONSTRAINT "class6math_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "curriculum" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,

    CONSTRAINT "curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "class" VARCHAR(2),
    "number" VARCHAR(15) NOT NULL,
    "dream" VARCHAR(200),
    "school" VARCHAR(100),
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
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
    "class" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_className_subjectName_topicName_key" ON "curriculum"("className", "subjectName", "topicName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
