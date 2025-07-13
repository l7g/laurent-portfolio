# Enhanced Projects Manual Setup Guide

Since the automated script is having issues, here's how to set up the enhanced projects structure manually:

## Step 1: First, let's check your current environment

Before running any migrations, make sure you have:

1. **Database connection**: Ensure your .env or .env.local file has a valid DATABASE_URL
2. **Development environment**: Make sure your development server can connect to the database

## Step 2: Add the new fields manually via Prisma

Instead of running a complex migration, let's update the schema and generate:

```powershell
# 1. Generate Prisma client with new schema (this should work even without migration)
npx prisma generate

# 2. Check if your database is accessible
npx prisma db pull

# 3. If the above works, apply the schema changes
npx prisma db push
```

## Step 3: Update existing projects

You can use the admin panel or run this SQL directly in your database:

```sql
-- Add new columns to existing table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcomes TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "caseStudyUrl" TEXT;

-- Update existing projects with default values
UPDATE projects SET
  demo = FALSE,
  year = EXTRACT(YEAR FROM "createdAt")
WHERE demo IS NULL;
```

## Step 4: Test the new components

1. Start your development server:

   ```powershell
   npm run dev
   ```

2. Visit these new pages:
   - http://localhost:3000/demos
   - http://localhost:3000/projects

## Step 5: Configure your demos

Use your admin panel to:

1. **Mark 3 projects as demos**: Set `demo = true` for your best projects
2. **Set categories**: Choose COMMERCIAL, CLIENT, or OPENSOURCE for each project
3. **Add metadata**: Set year, role, and outcomes for better presentation

## Alternative: Simple Direct Database Updates

If you prefer to set this up directly in your database admin tool:

```sql
-- Example: Mark your portfolio project as a demo
UPDATE projects SET
  demo = TRUE,
  category = 'DEMO',
  year = 2024,
  role = 'Full Stack Developer'
WHERE title ILIKE '%portfolio%';

-- Example: Categorize other projects
UPDATE projects SET category = 'OPENSOURCE' WHERE category IS NULL;
```

---

**Once you get this working, the new components should automatically:**

- Show your 3 demo projects on `/demos`
- Display all projects with enhanced filtering on `/projects`
- Provide better categorization and search functionality
