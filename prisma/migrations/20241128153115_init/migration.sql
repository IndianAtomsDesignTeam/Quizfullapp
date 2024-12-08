/*
  Warnings:

  - Added the required column `topic` to the `class6math` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "class6math" ADD COLUMN     "topic" TEXT NOT NULL;
