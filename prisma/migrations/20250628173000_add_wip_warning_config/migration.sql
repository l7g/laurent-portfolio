-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "showWipWarning" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "wipWarningText" TEXT;
