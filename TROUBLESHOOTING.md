# Deployment Data Fetching Troubleshooting Guide

## 🔍 Diagnosis Steps

### 1. Check Health Endpoint

After deploying, visit: `https://your-domain.com/api/health`

This will show you:

- Database connection status
- Entity counts (projects, blog posts, categories, users)
- Connection test results

### 2. Check Vercel Deployment Logs

In Vercel dashboard:

1. Go to your project
2. Click on "Functions" tab
3. Look for any errors in the logs
4. Check both build logs and runtime logs

### 3. Verify Environment Variables

In Vercel dashboard → Settings → Environment Variables:

**Required:**

- `DATABASE_URL` - Your Supabase connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your production URL

**Optional but recommended:**

- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password
- `ADMIN_NAME` - Admin user name

### 4. Common Issues and Solutions

#### Issue: "Database connection failed"

**Symptoms:** Health endpoint returns database disconnected
**Solutions:**

1. Check `DATABASE_URL` is correctly set in Vercel
2. Verify Supabase database is running
3. Check if connection string includes correct credentials

#### Issue: "Table doesn't exist" errors

**Symptoms:** Queries fail with table not found
**Solutions:**

1. Ensure `npx prisma migrate deploy` ran during build
2. Check build logs for migration errors
3. Manually run migrations via admin endpoint: `POST /api/admin/migrate`

#### Issue: "No data returned" but queries work

**Symptoms:** API returns empty arrays, health shows 0 counts
**Solutions:**

1. Check if deployment seed script ran successfully
2. Run seed manually: `POST /api/admin/migrate` with `{"action": "seed", "confirm": true}`
3. Verify data exists in Supabase dashboard

#### Issue: "Authentication errors"

**Symptoms:** NextAuth redirects or errors
**Solutions:**

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure admin user was created with correct email

## 🛠️ Manual Recovery Steps

### If Database Schema is Missing:

```bash
# In Vercel Functions logs or via admin endpoint
POST /api/admin/migrate
{
  "action": "migrate",
  "confirm": true
}
```

### If Data is Missing:

```bash
# Seed missing data
POST /api/admin/migrate
{
  "action": "seed",
  "confirm": true
}
```

### If Admin User Missing:

The deployment seed script should create the admin user automatically using environment variables.

## 📊 Debugging API Endpoints

Test these endpoints to isolate the issue:

1. **Health Check:** `/api/health` - Basic connectivity
2. **Projects:** `/api/projects` - Project data
3. **Blog Posts:** `/api/blog/posts` - Blog data
4. **Categories:** `/api/blog/categories` - Category data
5. **Settings:** `/api/public/settings` - Site settings

## 🔧 Quick Fixes

### Re-run Deployment Seed:

```bash
# In your local terminal (with production DB env vars)
npm run seed:deployment-seed
```

### Force Rebuild:

1. Go to Vercel dashboard
2. Trigger a new deployment
3. Check build logs for errors

### Database Reset (Last Resort):

⚠️ **Only if you don't have important data!**

```bash
# Locally with production DATABASE_URL
npx prisma migrate reset --force
npm run seed:deployment-seed
```

## 📞 Getting Help

If issues persist, check:

1. Vercel function logs for specific errors
2. Supabase logs for database errors
3. Browser network tab for failed API calls
4. Console errors in browser dev tools

## 🎯 Most Common Issue

**Scenario:** Everything builds successfully but no data shows
**Cause:** Database schema exists but no data was seeded
**Solution:** Run the seed script manually or via admin endpoint

The `/api/health` endpoint will quickly tell you if it's a connection issue or a data issue!
