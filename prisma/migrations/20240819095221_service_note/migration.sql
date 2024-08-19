-- CreateTable
CREATE TABLE "ServiceNote" (
    "id" SERIAL NOT NULL,
    "receiver" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceNote_pkey" PRIMARY KEY ("id")
);
