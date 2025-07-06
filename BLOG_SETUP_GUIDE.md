# Blog System Setup Guide

## Database Configuration

To run the blog system, you need to set up your database environment variables. Follow these steps:

### 1. Create .env.local file

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

### 2. Configure Database Connection

You have several options for your database:

#### Option A: Use Supabase (Recommended)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > Database
3. Copy your connection string
4. Update your `.env.local` file with your actual values:

```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_KEY="[YOUR_SERVICE_KEY]"
```

#### Option B: Use Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
```

#### Option C: Use Prisma PostgreSQL (Quick Setup)

For quick development, you can use Prisma's managed PostgreSQL:

```bash
npx prisma-postgres-create-database your-blog-db
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add this to your `.env.local`:

```env
NEXTAUTH_SECRET="[GENERATED_SECRET]"
```

### 4. Configure Email (Optional)

If you want to use email notifications for comments:

1. Sign up for [Resend](https://resend.com)
2. Get your API key
3. Add to `.env.local`:

```env
RESEND_API_KEY="[YOUR_RESEND_API_KEY]"
```

## Database Migration

Once your environment is configured, run the migration:

```bash
npx prisma migrate dev --name add_blog_enhancements
```

This will:

- Create the blog_posts table with SEO fields
- Create the blog_categories table
- Create the blog_comments table with likes
- Create the blog_series table
- Set up proper relationships

## Generate Prisma Client

```bash
npx prisma generate
```

## Seed Database (Optional)

To populate your database with sample data:

```bash
npx prisma db seed
```

## Verification

To verify your setup:

```bash
npx prisma studio
```

This opens a visual database browser where you can see all your tables.

## Blog Features Included

✅ **Admin Panel Integration**

- Complete blog management dashboard
- Post creation, editing, and deletion
- Category management
- Status management (Draft, Published, Archived)

✅ **Rich Text Editor**

- WYSIWYG markdown editor
- Image upload support
- Live preview
- Auto-save functionality

✅ **Comments System**

- User comments with moderation
- Like/dislike functionality
- Spam detection
- Email notifications

✅ **SEO Optimization**

- Meta tags generation
- Structured data (JSON-LD)
- Open Graph and Twitter cards
- XML sitemap

✅ **Social Sharing**

- Twitter, Facebook, LinkedIn integration
- Copy link functionality
- Native sharing API support

✅ **RSS Feed**

- Automatic RSS generation
- SEO-friendly URLs
- Category-based feeds

## API Endpoints

- `GET /api/blog/posts` - List all posts
- `GET /api/blog/posts/[slug]` - Get single post
- `POST /api/blog/posts/[slug]/comments` - Add comment
- `GET /api/admin/blog/posts` - Admin post management
- `POST /api/admin/blog/posts` - Create new post
- `GET /api/rss` - RSS feed
- `GET /api/sitemap` - XML sitemap

## Performance Optimizations

- Efficient database queries with proper indexing
- Image optimization with Vercel Blob Storage
- Lazy loading for comments
- Cached RSS feeds
- Optimized bundle sizes

## Security Features

- Comment moderation
- Spam detection
- XSS protection
- CSRF protection
- SQL injection prevention
- Admin authentication

## Getting Started

1. Follow the database configuration steps above
2. Run `npm install` to install dependencies
3. Run `npx prisma migrate dev --name add_blog_enhancements`
4. Run `npx prisma generate`
5. Run `npm run dev` to start the development server
6. Visit `http://localhost:3000/admin/blog` to manage your blog

## Troubleshooting

If you encounter issues:

1. **Database connection errors**: Check your DATABASE_URL in .env.local
2. **Migration errors**: Ensure your database is running and accessible
3. **Permission errors**: Make sure your database user has CREATE privileges
4. **Environment variables**: Ensure all required variables are set in .env.local

For more help, check the console logs or create an issue in the repository.
