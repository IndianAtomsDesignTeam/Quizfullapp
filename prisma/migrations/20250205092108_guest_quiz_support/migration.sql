-- AlterTable
ALTER TABLE "session" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "achievement" DOUBLE PRECISION,
ADD COLUMN     "pace" DOUBLE PRECISION,
ADD COLUMN     "streak" INTEGER;
