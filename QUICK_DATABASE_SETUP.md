# Quick Fix for Database Setup

## The Issue

You're getting `Environment variable not found: DATABASE_URL` because your `.env.local` file doesn't exist or doesn't have the correct database URL.

## Quick Solution

### Step 1: Create .env.local file

Copy the template and configure your database:

```bash
cp .env.local.example .env.local
```

### Step 2: Configure Database Connection

Edit `.env.local` and add your database connection string. Here are your options:

#### Option A: Local PostgreSQL

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

#### Option B: Supabase (Recommended)

```env
DATABASE_URL="postgresql://postgres:your_password@your-project-ref.supabase.co:5432/postgres"
```

#### Option C: Quick SQLite (for development only)

```env
DATABASE_URL="file:./dev.db"
```

And update your `prisma/schema.prisma` datasource to:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3: Run the Migration

Once you have configured your DATABASE_URL, run:

```bash
npx prisma migrate dev --name add_blog_enhancements
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

## If You Want to Use Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Replace `[YOUR_PASSWORD]` with your actual password
6. Add to `.env.local`:

```env
DATABASE_URL="postgresql://postgres:your_actual_password@your-project-ref.supabase.co:5432/postgres"
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_KEY="your_service_key"
```

## If You Want to Use Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE portfolio_blog;
   ```
3. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/portfolio_blog"
   ```

## Test Your Setup

```bash
npx prisma db push
npx prisma studio
```

This should open Prisma Studio where you can see your database tables.

## Next Steps After Database Setup

1. `npm run dev` - Start development server
2. Visit `http://localhost:3000/admin/blog` - Access blog admin
3. Visit `http://localhost:3000/blog` - View your blog

## Need Help?

If you're still having issues:

1. Check that PostgreSQL is running (if using local)
2. Verify your connection string is correct
3. Make sure your database user has the right permissions
4. Check the console for specific error messages
