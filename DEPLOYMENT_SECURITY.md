# Database Migration and Deployment Guide

## 🗃️ Database State When Deploying

### What Happens to Your Database?

**Current Situation:**

- Your database has WIP warning configuration fields and seed data
- When you deploy to production, you have options for handling the database

### Option 1: Fresh Production Database (Recommended)

```bash
# 1. Deploy with fresh database
# 2. Run migrations automatically (Vercel does this)
# 3. Run production seed script
npm run seed:production
```

### Option 2: Copy Development Data

```bash
# Export current database
npx prisma db push --force-reset
pg_dump $DEV_DATABASE_URL > backup.sql

# Import to production (be careful!)
psql $PROD_DATABASE_URL < backup.sql
```

## 🔐 Secure Deployment Setup

### Method 1: Environment Variables (Vercel/Production)

1. **Set environment variables in Vercel:**

```
ADMIN_EMAIL=your-secure-email@domain.com
ADMIN_PASSWORD=your-super-secure-password-123!
ADMIN_NAME=Your Name
```

2. **Run deployment seed:**

```bash
npm run seed:production
```

### Method 2: Interactive Setup (Safer)

1. **After deployment, run setup script:**

```bash
npm run setup:admin
```

2. **Enter credentials when prompted (password hidden)**

### Method 3: Manual Database Creation

1. **Use Prisma Studio or direct database access:**

```bash
npx prisma studio
```

2. **Create admin user manually with bcrypt hash**

## 📦 Package.json Scripts

Add these to your package.json:

```json
{
  "scripts": {
    "seed:dev": "node prisma/seed.js",
    "seed:production": "node scripts/deployment-seed.js",
    "setup:admin": "node scripts/setup-admin.js",
    "db:reset": "npx prisma migrate reset --force",
    "db:deploy": "npx prisma migrate deploy"
  }
}
```

## 🔄 Gradual Merge Strategy

### Branch Protection:

1. **Keep sensitive seeds in development branch**
2. **Only merge production-ready code to main**
3. **Use different seed scripts per environment**

### Deployment Flow:

```
development → staging → main → production
     ↓           ↓        ↓         ↓
  dev-seed   test-seed  no-seed  prod-seed
```

## ⚙️ Vercel Deployment Settings

### Build Command:

```bash
npm run build && npm run db:deploy
```

### Post-Deploy Command (optional):

```bash
npm run seed:production
```

## 🛡️ Security Best Practices

1. **Never commit production passwords**
2. **Use strong passwords (16+ characters)**
3. **Enable 2FA where possible**
4. **Rotate passwords regularly**
5. **Use different credentials per environment**
6. **Monitor admin access logs**

## 🔍 Environment Detection

Your seed script can detect environment:

```javascript
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

if (isProduction) {
  // Use secure production seeding
} else {
  // Use development seeding
}
```
