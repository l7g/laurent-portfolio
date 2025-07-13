-- Add demo field and enhanced project categorization
-- This migration adds new fields to support the enhanced projects structure

-- Add demo boolean field
ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo BOOLEAN DEFAULT FALSE;

-- Add category enum (will be handled by Prisma)
-- Note: In production, you'll need to run `prisma migrate dev` to properly create the enum

-- Add enhanced project fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcomes TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study_url VARCHAR(255);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_demo ON projects(demo);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(year);

-- Update existing projects with default values
UPDATE projects SET 
  demo = FALSE,
  year = EXTRACT(YEAR FROM created_at)
WHERE demo IS NULL;

-- Example: Set your portfolio as a full-stack demo
-- Uncomment and modify the ID to match your portfolio project:
-- UPDATE projects SET 
--   demo = TRUE, 
--   category = 'DEMO',
--   year = 2024,
--   role = 'Full Stack Developer'
-- WHERE title ILIKE '%portfolio%' OR title ILIKE '%laurent%';

COMMIT;
