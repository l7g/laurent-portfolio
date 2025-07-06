-- AlterTable
ALTER TABLE "academic_programs" ADD COLUMN     "actualGraduationDate" TIMESTAMP(3),
ADD COLUMN     "dissertationDeadline" TIMESTAMP(3),
ADD COLUMN     "dissertationStarted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dissertationSubmissionDate" TIMESTAMP(3),
ADD COLUMN     "dissertationSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dissertationTitle" TEXT;
