-- This migration resolves schema drift
-- The demo and featured fields were added manually and already exist
-- This migration makes Prisma aware of them without changing the database

-- No actual SQL changes needed - fields already exist in production
SELECT 1; -- No-op statement
