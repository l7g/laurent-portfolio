-- Add demo field to projects table
ALTER TABLE projects ADD COLUMN demo BOOLEAN DEFAULT FALSE;

-- Add category field for better organization
-- Commercial, Client, OpenSource, Demo
ALTER TABLE projects ADD COLUMN category VARCHAR(50) DEFAULT 'OpenSource';

-- Add more fields for enhanced project display
ALTER TABLE projects ADD COLUMN year INTEGER;
ALTER TABLE projects ADD COLUMN role VARCHAR(255);
ALTER TABLE projects ADD COLUMN outcomes TEXT[];
ALTER TABLE projects ADD COLUMN caseStudyUrl VARCHAR(255);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_demo ON projects(demo);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_flagship ON projects(flagship);

-- Update existing projects to set demo status for your 3 main demos
-- You'll need to run this after deciding which 3 projects are your demos
-- UPDATE projects SET demo = TRUE, category = 'Demo' WHERE id IN ('demo1', 'demo2', 'demo3');
