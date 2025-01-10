/*
  Warnings:

  - Added the required column `number` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "number" VARCHAR(15) NOT NULL;
