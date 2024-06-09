-- CreateTable
CREATE TABLE "Greeting" (
    "id" SERIAL NOT NULL,
    "greeting" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Greeting_pkey" PRIMARY KEY ("id")
);
