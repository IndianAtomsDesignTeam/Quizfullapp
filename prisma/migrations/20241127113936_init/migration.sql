-- CreateTable
CREATE TABLE "QuizQuestions" (
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizQuestions_pkey" PRIMARY KEY ("id")
);
