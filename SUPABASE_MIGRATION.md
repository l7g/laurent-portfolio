# Supabase Migration Guide

## Step 1: Environment Variables

Add these to your `.env.local` file (create if it doesn't exist):

```bash
# Supabase Configuration
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_KEY="[YOUR_SERVICE_KEY]"

# Keep your existing variables
NEXTAUTH_SECRET="[YOUR_SECRET]"
RESEND_API_KEY="[YOUR_RESEND_KEY]"
```

## Step 2: Supabase URL Format

Your Supabase DATABASE_URL should look like:

```
postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
```

Where:

- `[PASSWORD]` is your database password
- `[PROJECT_REF]` is your project reference from Supabase dashboard

## Step 3: Migration Process

1. **Push your current schema to Supabase:**

   ```bash
   npx prisma db push
   ```

2. **Generate new Prisma client:**

   ```bash
   npx prisma generate
   ```

3. **Migrate your data (if you have existing data):**

   ```bash
   # Export current data
   node scripts/backup-before-supabase.js

   # Import to Supabase
   node scripts/restore-to-supabase.js
   ```

## Step 4: Test the Connection

```bash
npm run dev
```

## Troubleshooting

- Make sure your IP is whitelisted in Supabase (or use 0.0.0.0/0 for development)
- Check that your database password doesn't contain special characters that need URL encoding
- Verify your project reference is correct from the Supabase dashboard
