# Neon Database Migration Guide

## Step 1: Create Neon Database

1. Go to: https://console.neon.tech/
2. Sign up with GitHub (easiest)
3. Create new project: "portfolio-db"
4. Select region closest to you
5. Copy the connection string

## Step 2: Update Environment Variables

Replace your DATABASE_URL in .env.local with the Neon connection string

## Step 3: Run Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Neon (creates tables)
npx prisma db push

# Optional: Check if everything worked
npx prisma studio
```

## Step 4: Test Contact Forms

Your contact forms should now work with the online database!

## Connection String Format:

postgresql://username:password@host/database?sslmode=require
