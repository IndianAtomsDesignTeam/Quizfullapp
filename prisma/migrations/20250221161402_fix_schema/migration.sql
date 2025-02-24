/*
  Warnings:

  - You are about to drop the `svgLibrary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "curriculum" DROP CONSTRAINT "curriculum_subjectName_fkey";

-- DropTable
DROP TABLE "svgLibrary";
