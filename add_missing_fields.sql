-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('DEMO', 'COMMERCIAL', 'CLIENT', 'OPENSOURCE');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "category" "ProjectCategory" NOT NULL DEFAULT 'OPENSOURCE';
ALTER TABLE "projects" ADD COLUMN     "caseStudyUrl" TEXT;
ALTER TABLE "projects" ADD COLUMN     "outcomes" TEXT[];
ALTER TABLE "projects" ADD COLUMN     "role" TEXT;
ALTER TABLE "projects" ADD COLUMN     "year" INTEGER;
