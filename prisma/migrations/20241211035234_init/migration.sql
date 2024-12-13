-- CreateTable
CREATE TABLE "Curriculum" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_className_subjectName_topicName_key" ON "Curriculum"("className", "subjectName", "topicName");
