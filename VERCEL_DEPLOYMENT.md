# Vercel Deployment Guide

## Safe Production Deployment Strategy

This project is configured for safe, idempotent deployments on Vercel with Supabase as the database.

### What Happens During Deployment

1. **Install Dependencies**: `npm install`
2. **Generate Prisma Client**: `npx prisma generate`
3. **Seed Missing Data**: `npm run seed:deployment-seed`
4. **Build Application**: `npm run build`

### Why We Don't Run Migrations on Every Deploy

**❌ NOT INCLUDED:** `npx prisma migrate deploy`

Running migrations on every deployment can:

- Reset data unexpectedly
- Cause downtime
- Apply unwanted schema changes
- Break production data

### Schema Migration Strategy

#### For Development

```bash
# Make schema changes locally
npm run db:push

# Or create and apply migrations
npx prisma migrate dev --name "your-change-description"
```

#### For Production

Schema changes in production should be handled manually and carefully:

1. **Test locally first**
2. **Create a database backup**
3. **Run migrations manually when ready**:
   ```bash
   npx prisma migrate deploy
   ```
4. **Or use the admin dashboard migration endpoint** (if implemented)

### Deployment Seed Script

The `scripts/deployment-seed.js` script is designed to be **idempotent**:

- Only creates missing entities
- Skips existing data
- Uses environment variables for admin setup
- Safe to run on every deployment

### Environment Variables in Vercel

Set these in your Vercel dashboard (not in `.env.local`):

```
DATABASE_URL=your_supabase_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Name
```

### Manual Operations

If you need to run operations manually in production:

#### Available Scripts

```bash
# Seed production data (idempotent)
npm run seed:deployment-seed

# Deploy migrations (use with caution)
npm run db:deploy

# Reset database (NEVER use in production)
npm run db:reset
```

#### Via API Endpoints (if implemented)

- `POST /api/admin/migrate` - Run pending migrations
- `POST /api/admin/seed` - Seed missing data

### Rollback Strategy

If a deployment causes issues:

1. **Revert to previous Vercel deployment**
2. **Restore database from backup if needed**
3. **Fix issues in development**
4. **Redeploy when ready**

### Best Practices

1. **Test all changes locally first**
2. **Use staging environment for testing migrations**
3. **Create database backups before major changes**
4. **Deploy during low-traffic periods**
5. **Monitor deployment logs and application health**

### Troubleshooting

#### Build Failures

- Check Vercel build logs
- Ensure all environment variables are set
- Verify Prisma schema is valid

#### Database Connection Issues

- Verify DATABASE_URL is correct
- Check Supabase connection limits
- Ensure database is accessible from Vercel

#### Seed Script Issues

- Check environment variables for admin setup
- Verify database schema is up to date
- Review deployment-seed.js logs

### Emergency Procedures

#### If Deployment Breaks Production

1. **Immediately revert** to last working Vercel deployment
2. **Check error logs** in Vercel dashboard
3. **Restore database** from backup if data is affected
4. **Fix issues** in development environment
5. **Test thoroughly** before redeploying

#### Database Recovery

1. **Stop all deployments**
2. **Restore from latest backup**
3. **Verify data integrity**
4. **Test application functionality**
5. **Resume normal operations**
