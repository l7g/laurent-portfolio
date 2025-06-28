# Safe Deployment Guide

## Overview

This guide explains the safe database deployment process that has been implemented to fix the previous unsafe `npx prisma db push` usage in production.

## What Was Fixed

### Previous Issues

- ❌ `npx prisma db push` was used in production (unsafe)
- ❌ Database operations ran during build phase
- ❌ Risk of data loss from direct schema pushes
- ❌ Deployment failures when database was unavailable

### New Safe Approach

- ✅ Uses `npx prisma migrate deploy` (safe for production)
- ✅ Database operations run in postinstall phase
- ✅ Graceful handling of database unavailability
- ✅ No build failures from database issues

## Deployment Process

### 1. Build Phase

The build phase now only handles:

- Next.js application build
- Prisma client generation
- No database operations

### 2. Postinstall Phase

After successful build, the postinstall script:

- Checks if running in production environment
- Tests database connectivity
- Runs safe migrations using `npx prisma migrate deploy`
- Seeds database only if empty
- Gracefully handles failures without breaking deployment

## Environment Variables

Ensure these are set in your Vercel environment:

```bash
# Required for database operations
DATABASE_URL=your_production_database_url
NODE_ENV=production

# Required for admin user creation
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Admin

# NextAuth configuration
NEXTAUTH_URL=https://www.laurentgagne.com
NEXTAUTH_SECRET=your_nextauth_secret
```

## Migration Management

### Creating New Migrations

```bash
# In development
npx prisma migrate dev --name migration_name

# This creates a new migration file in prisma/migrations/
```

### Deploying Migrations

```bash
# In production (handled automatically by postinstall script)
npx prisma migrate deploy
```

### Manual Database Operations

```bash
# Reset database (development only)
npm run db:reset

# Deploy migrations manually
npm run db:deploy

# Push schema changes (development only)
npm run db:push
```

## Troubleshooting

### Database Connection Issues

If the postinstall script fails to connect to the database:

- Check `DATABASE_URL` environment variable
- Verify database is accessible from Vercel
- Check firewall/network settings

### Migration Failures

If migrations fail:

- Check migration files are up to date
- Verify database schema matches expected state
- Review migration logs in Vercel deployment

### Seeding Issues

If seeding fails:

- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
- Verify backup file exists at `scripts/production-backup.json`
- Review seeding logs in Vercel deployment

## Best Practices

1. **Always use migrations** instead of `db push` in production
2. **Test migrations locally** before deploying
3. **Backup data** before major schema changes
4. **Monitor deployment logs** for database operation status
5. **Use environment-specific configurations**

## Rollback Strategy

If a deployment fails:

1. Check Vercel deployment logs
2. Verify database connectivity
3. Manually run migrations if needed: `npx prisma migrate deploy`
4. Manually seed if needed: `npm run seed:deployment`

## Security Notes

- Database operations only run in production environment
- Admin credentials are securely handled via environment variables
- Failed database operations don't break the build
- Sensitive operations are logged but don't expose secrets
