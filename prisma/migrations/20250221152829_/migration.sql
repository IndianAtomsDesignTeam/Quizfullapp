/*
  Warnings:

  - You are about to drop the column `svg` on the `svgLibrary` table. All the data in the column will be lost.
  - Added the required column `svgUrl` to the `svgLibrary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "svgLibrary" DROP COLUMN "svg",
ADD COLUMN     "svgUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_subjectName_fkey" FOREIGN KEY ("subjectName") REFERENCES "svgLibrary"("subjectName") ON DELETE RESTRICT ON UPDATE CASCADE;
