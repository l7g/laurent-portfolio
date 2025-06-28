# Deployment Process

## Overview

The portfolio uses a robust deployment system that ensures consistent data restoration from the production backup during every deployment.

## Build Process

During Vercel deployment, the following steps occur:

1. **Build**: `npm run build` - Builds the Next.js application
2. **Database Setup**: `npx prisma db push` - Ensures database schema is up to date
3. **Data Restoration**: `npm run seed:deployment` - Restores content from production backup

## Deployment Script (`scripts/deployment-restore.js`)

This script safely handles database seeding during deployment:

- **Checks if data exists**: If the database already has content, it skips restoration
- **Restores from backup**: Uses `scripts/production-backup.json` to restore all content
- **Fallback protection**: Creates minimal data if backup is missing or fails
- **Admin user creation**: Ensures admin user exists using environment variables

## Environment Variables Required

```
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Name (optional)
DATABASE_URL=your-database-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

## Production Backup

- **Location**: `scripts/production-backup.json`
- **Updates**: Run `npm run backup:create` when you want to capture current production state
- **Contains**: All portfolio content, projects, skills, sections, and site settings

## Safe Deployment

- Database operations only happen at runtime, not during build
- Multiple fallback mechanisms ensure deployment succeeds even if backup fails
- Existing data is preserved (no accidental overwrites)
- Admin user is always ensured to exist

## Manual Operations

```bash
# Create new production backup
npm run backup:create

# Test deployment script locally
npm run seed:deployment

# Setup admin user manually
npm run setup:admin

# Reset database (development only!)
npm run db:reset
```

## Security

- Passwords are properly hashed using bcrypt
- Environment variables are required for admin access
- Database connection strings are never committed to version control
