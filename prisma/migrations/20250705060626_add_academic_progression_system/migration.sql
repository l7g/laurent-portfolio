-- CreateEnum
CREATE TYPE "AcademicStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DEFERRED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "academic_programs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "accreditation" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expectedEnd" TIMESTAMP(3) NOT NULL,
    "currentYear" INTEGER NOT NULL DEFAULT 1,
    "totalYears" INTEGER NOT NULL DEFAULT 4,
    "mode" TEXT,
    "status" "AcademicStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_progressions" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "programId" TEXT,
    "currentLevel" INTEGER NOT NULL DEFAULT 0,
    "targetLevel" INTEGER NOT NULL DEFAULT 100,
    "year1Target" INTEGER,
    "year2Target" INTEGER,
    "year3Target" INTEGER,
    "year4Target" INTEGER,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autoUpdate" BOOLEAN NOT NULL DEFAULT true,
    "isAcademicSkill" BOOLEAN NOT NULL DEFAULT false,
    "isTechnicalSkill" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "skill_progressions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "skill_progressions" ADD CONSTRAINT "skill_progressions_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_progressions" ADD CONSTRAINT "skill_progressions_programId_fkey" FOREIGN KEY ("programId") REFERENCES "academic_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
