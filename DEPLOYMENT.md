# Portfolio Deployment Guide

This guide provides instructions for deploying your portfolio website to various platforms.

## Vercel Deployment (Recommended)

Vercel provides the easiest deployment experience for Next.js applications.

### Steps:

1. **Push your code to GitHub**

   Make sure your project is in a GitHub repository.

2. **Connect your repository to Vercel**

   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select "Import Git Repository"
   - Select your portfolio repository
   - Configure your project settings

3. **Configure Environment Variables**

   Add all required environment variables in the Vercel dashboard under your project's settings:

   - `DATABASE_URL` - Your PostgreSQL connection string
   - `SMTP_HOST` - Your email server host
   - `SMTP_PORT` - Your email server port
   - `SMTP_USER` - Your email username
   - `SMTP_PASS` - Your email password/app password
   - `SMTP_FROM` - Email address to send from
   - `NEXT_PUBLIC_APP_URL` - Your production domain (e.g., `https://your-portfolio.vercel.app`)

4. **Deploy**

   Vercel will automatically deploy your application. Each push to your main branch will trigger a new deployment.

## Database Setup for Production

### Option 1: Supabase (Recommended)

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Get your PostgreSQL connection string from the Database settings
4. Add this as your `DATABASE_URL` environment variable in Vercel

### Option 2: Railway

1. Sign up for [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Get your connection string from the "Connect" tab
4. Add as your `DATABASE_URL` environment variable

### Option 3: Neon

1. Sign up for [Neon](https://neon.tech)
2. Create a new PostgreSQL database
3. Get your connection string
4. Add as your `DATABASE_URL` environment variable

## Custom Domain Setup

1. Purchase a domain from a provider like Namecheap, Google Domains, etc.
2. In your Vercel project settings, go to "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings at your domain provider

## Email Setup for Production

For production, consider using:

- [SendGrid](https://sendgrid.com/) - 100 emails/day free tier
- [Mailgun](https://www.mailgun.com/) - 5,000 emails/month for 3 months free
- [Amazon SES](https://aws.amazon.com/ses/) - Very low cost, 62,000 emails/month free when sending from EC2

Update your SMTP settings in your environment variables accordingly.

## Troubleshooting

### Database Connection Issues

- Ensure your IP address is allowed in the database firewall settings
- Verify your connection string is correct, including username, password, host, and database name
- Check that your database is running and accessible

### Build Failures

- Run `npm build` locally before deploying to catch any build errors
- Check Vercel logs for specific error messages
- Ensure all dependencies are correctly installed

### Contact Form Not Working

- Verify SMTP settings are correctly set in environment variables
- Check if the email service provider has any restrictions
- Review server logs for any API route errors

## Monitoring and Analytics

Consider adding:

- [Vercel Analytics](https://vercel.com/analytics) - Simple page view tracking
- [Google Analytics](https://analytics.google.com/) - Comprehensive visitor analytics
- [Sentry](https://sentry.io/) - Error tracking and monitoring

## Regular Maintenance

- Keep dependencies updated with `npm audit` and `npm update`
- Periodically check for database and email service uptime
- Monitor performance using Vercel's built-in analytics

---

For additional help, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment).

# 🚀 Safe Production Deployment Guide

## Blog Comments System Deployment

This guide provides a step-by-step process to safely deploy the new blog comments system to production.

## 🔍 Pre-Deployment Checklist

### 1. **Environment Setup**

- [ ] Development database URL configured (`DATABASE_URL`)
- [ ] Production database URL configured (`PROD_DATABASE_URL`)
- [ ] Email service configured (Resend API key)
- [ ] Domain verification completed for email
- [ ] Admin credentials set
- [ ] All environment variables validated

### 2. **Code Preparation**

- [ ] All comment-related code tested locally
- [ ] Email notifications working in development
- [ ] Admin interface functioning
- [ ] Schema changes validated

### 3. **Database Preparation**

- [ ] Current production backup available
- [ ] Migration files generated and tested
- [ ] Schema changes documented
- [ ] Rollback plan prepared

## 📋 Deployment Steps

### Environment Variable Setup

Make sure your `.env.local` file contains both database URLs:

```bash
# Development Database
DATABASE_URL="postgresql://your-dev-db-url"

# Production Database
PROD_DATABASE_URL="postgresql://your-prod-db-url"

# Other required variables
RESEND_API_KEY="your-resend-key"
ADMIN_EMAIL="your-admin-email"
# ... etc
```

### Step 1: Prepare the Migration

Generate and validate the comments migration:

```bash
# Generate migration for comments system
npm run migrate:prepare-comments

# This will:
# - Check current schema state
# - Generate migration if needed
# - Validate the migration
# - Prepare for production deployment
```

### Step 2: Test Locally

Ensure everything works in development:

```bash
# Reset and test full migration
npm run db:reset
npm run db:seed

# Test the application
npm run dev

# Verify:
# - Comments can be posted
# - Email notifications work
# - Admin interface functions
# - Auto-approval works correctly
```

### Step 3: Create Production Backup

Create a backup before deployment:

```bash
# Create production backup only
npm run deploy:backup-only

# This creates a timestamped backup in ./backups/
```

### Step 4: Deploy to Production

Run the complete deployment process:

```bash
# Full production deployment
npm run deploy:to-production

# This will:
# 1. Verify environment
# 2. Create backup
# 3. Validate schema
# 4. Test on development
# 5. Deploy to production
# 6. Verify deployment
```

### Step 5: Verify Production

Verify the deployment worked:

```bash
# Verify production state only
npm run deploy:verify-only

# Manual verification:
# - Check admin dashboard
# - Test comment posting
# - Verify email notifications
# - Check database state
```

## 🔒 Safety Features

### Automatic Backups

- Timestamped SQL dumps created before deployment
- Stored in `./backups/` directory
- Can be used for rollback if needed

### Validation Checks

- Schema validation before deployment
- Development testing before production
- Environment variable verification
- Migration status checking

### Rollback Capability

If something goes wrong:

```bash
# Restore from backup (replace TIMESTAMP)
psql $PROD_DATABASE_URL < ./backups/prod-backup-TIMESTAMP.sql

# Or reset to specific migration
npx prisma migrate reset --to MIGRATION_NAME
```

## 📊 Database Changes Summary

The comments system adds:

### New Table: `blog_comments`

```sql
CREATE TABLE blog_comments (
  id         TEXT PRIMARY KEY,
  content    TEXT NOT NULL,
  author     TEXT NOT NULL,
  email      TEXT NOT NULL,
  website    TEXT,
  isApproved BOOLEAN DEFAULT false,
  likes      INTEGER DEFAULT 0,
  postId     TEXT NOT NULL,
  createdAt  TIMESTAMP DEFAULT now(),
  updatedAt  TIMESTAMP NOT NULL,
  FOREIGN KEY (postId) REFERENCES blog_posts(id) ON DELETE CASCADE
);
```

### Modified Features

- **Email System**: Comment notifications with smart approval
- **Admin Interface**: Comment management dashboard
- **API Routes**: Comment CRUD operations with moderation
- **Spam Detection**: Automatic flagging of potential spam

## 🎯 Post-Deployment Tasks

### 1. **Immediate Verification**

- [ ] Admin login works
- [ ] Comment posting works
- [ ] Email notifications arrive
- [ ] Comment moderation functions

### 2. **Application Deployment**

After database deployment, deploy your application:

```bash
# Deploy to Vercel/your platform
npm run build
# Deploy through your CI/CD or manual deployment
```

### 3. **Production Testing**

- [ ] Post a test comment
- [ ] Verify email notification
- [ ] Check admin dashboard
- [ ] Test comment approval/rejection

---

# Original Deployment Guide
