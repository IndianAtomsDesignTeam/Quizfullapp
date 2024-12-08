/*
  Warnings:

  - A unique constraint covering the columns `[qno]` on the table `class6math` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "class6math_qno_key" ON "class6math"("qno");
