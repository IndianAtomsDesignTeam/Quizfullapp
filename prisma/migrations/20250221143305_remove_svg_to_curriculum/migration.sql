-- CreateTable
CREATE TABLE "svgLibrary" (
    "id" SERIAL NOT NULL,
    "subjectName" TEXT NOT NULL,
    "svg" TEXT NOT NULL,

    CONSTRAINT "svgLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "svgLibrary_subjectName_key" ON "svgLibrary"("subjectName");
