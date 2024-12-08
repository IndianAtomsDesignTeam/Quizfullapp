/*
  Warnings:

  - You are about to drop the column `optionA` on the `class6math` table. All the data in the column will be lost.
  - You are about to drop the column `optionB` on the `class6math` table. All the data in the column will be lost.
  - You are about to drop the column `optionC` on the `class6math` table. All the data in the column will be lost.
  - You are about to drop the column `optionD` on the `class6math` table. All the data in the column will be lost.
  - Added the required column `optiona` to the `class6math` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionb` to the `class6math` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionc` to the `class6math` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optiond` to the `class6math` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "class6math" DROP COLUMN "optionA",
DROP COLUMN "optionB",
DROP COLUMN "optionC",
DROP COLUMN "optionD",
ADD COLUMN     "optiona" TEXT NOT NULL,
ADD COLUMN     "optionb" TEXT NOT NULL,
ADD COLUMN     "optionc" TEXT NOT NULL,
ADD COLUMN     "optiond" TEXT NOT NULL;
