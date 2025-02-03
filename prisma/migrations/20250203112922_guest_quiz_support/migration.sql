-- AlterTable
ALTER TABLE "session" ADD COLUMN     "timeTaken" INTEGER;

-- CreateTable
CREATE TABLE "guestSession" (
    "id" TEXT NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "timeTaken" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guestSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guestUserQuestion" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userAnswer" TEXT,
    "isCorrect" BOOLEAN,

    CONSTRAINT "guestUserQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guestUserQuestion" ADD CONSTRAINT "guestUserQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "guestSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guestUserQuestion" ADD CONSTRAINT "guestUserQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
