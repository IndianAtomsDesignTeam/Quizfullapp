/*
  Warnings:

  - You are about to drop the column `class` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `dream` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.
  - Added the required column `studentClass` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `dream` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `school` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "class",
DROP COLUMN "number",
ADD COLUMN     "studentClass" VARCHAR(100) NOT NULL,
ALTER COLUMN "dream" SET NOT NULL,
ALTER COLUMN "dream" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "school" SET NOT NULL;

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userQuestion" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "isCorrect" BOOLEAN,

    CONSTRAINT "userQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userQuestion" ADD CONSTRAINT "userQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userQuestion" ADD CONSTRAINT "userQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userQuestion" ADD CONSTRAINT "userQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
