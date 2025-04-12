-- CreateTable
CREATE TABLE "curriculum2" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "topicName" TEXT,

    CONSTRAINT "curriculum2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curriculum2_className_subjectName_topicName_key" ON "curriculum2"("className", "subjectName", "topicName");
