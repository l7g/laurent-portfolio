-- Manual SQL to clean up duplicates and add flagship projects

-- 1. First, let's see what sections we have
SELECT name, "displayName", "createdAt", id FROM portfolio_sections ORDER BY name, "createdAt";

-- 2. Delete duplicate sections (keep the first one of each name)
DELETE FROM portfolio_sections 
WHERE id NOT IN (
  SELECT DISTINCT ON (name) id 
  FROM portfolio_sections 
  ORDER BY name, "createdAt" ASC
);

-- 3. Add flagship column to projects (if not already added by Prisma)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS flagship BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "detailedDescription" TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenges TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solutions TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS results TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "clientName" TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "projectDuration" TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "teamSize" TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "myRole" TEXT;

-- 4. Update existing projects to be flagship
UPDATE projects 
SET flagship = true,
    "detailedDescription" = 'Comprehensive project with advanced features and detailed implementation.',
    challenges = 'Technical complexity and scalability requirements.',
    solutions = 'Modern architecture patterns and optimized performance.',
    results = 'Successful deployment with measurable improvements.',
    "clientName" = 'Sample Client',
    "projectDuration" = '3-4 months',
    "teamSize" = 'Solo project',
    "myRole" = 'Full-stack developer'
WHERE featured = true;

-- 5. Verify the cleanup
SELECT COUNT(*) as total_sections FROM portfolio_sections;
SELECT name, COUNT(*) as count FROM portfolio_sections GROUP BY name HAVING COUNT(*) > 1;
SELECT title, featured, flagship FROM projects ORDER BY "sortOrder";
