-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentProject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "DepartmentProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DepartmentProject" ADD CONSTRAINT "DepartmentProject_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
