# Production Database Setup Guide

When your website is deployed (e.g., on Vercel), you have several options for setting up your database. Here's how each method works:

## Method 1: Automatic Setup During Deployment (Recommended)

Your project is already configured for this! When you deploy to Vercel:

### How it works:

1. **Environment Variables**: Set these in your Vercel dashboard:

   ```
   DATABASE_URL=your_neon_postgres_url
   ADMIN_EMAIL=your_admin@email.com
   ADMIN_PASSWORD=your_secure_password
   ADMIN_NAME=Your Name
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

2. **Automatic Seeding**: The `vercel.json` file runs the seed script during build:

   ```json
   {
     "buildCommand": "npm run build && npm run seed:production"
   }
   ```

3. **Result**: Database is automatically populated with:
   - Your admin user (from environment variables)
   - Default portfolio sections
   - Ready to use!

### To Deploy:

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy - everything happens automatically!

## Method 2: One-Time API Setup (Backup Option)

If automatic seeding doesn't work, you can use the API endpoint:

### Setup:

1. Add `SETUP_SECRET_KEY=your_secret_key` to environment variables
2. After deployment, make a POST request to: `https://your-domain.vercel.app/api/setup`
3. Include header: `x-setup-key: your_secret_key`

### Example using curl:

```bash
curl -X POST https://your-domain.vercel.app/api/setup \
  -H "x-setup-key: your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password",
    "name": "Admin Name"
  }'
```

### ⚠️ Important Security Notes:

- **Remove or disable the setup endpoint after first use!**
- Delete the `/api/setup/route.ts` file after setup
- Or add environment check to disable it in production

## Method 3: Database Dashboard (Manual)

Some database providers (like Neon, PlanetScale) offer web-based SQL editors:

1. Log into your database provider's dashboard
2. Use the SQL editor to run migration and seed scripts manually
3. Copy the SQL from your migration files

## What Gets Created:

After setup, your database will have:

### Admin User

- Email and password you specified
- Admin role for dashboard access
- Access to `/admin` dashboard

### Portfolio Sections

- Hero section
- About section
- Projects section
- Contact section

### Ready for Content

- Add projects through admin dashboard
- Upload images via Vercel Blob
- Customize all content

## Next Steps After Setup:

1. **Visit `/admin`** - Log in with your admin credentials
2. **Add Projects** - Upload images, add descriptions, set WIP status
3. **Customize Sections** - Edit about section, contact info, etc.
4. **Security** - Remove setup endpoints, review environment variables

## Environment Variables Checklist:

```
✅ DATABASE_URL - Your PostgreSQL connection string
✅ ADMIN_EMAIL - Your admin login email
✅ ADMIN_PASSWORD - Secure admin password
✅ ADMIN_NAME - Your display name
✅ NEXTAUTH_SECRET - Random secret for NextAuth
✅ NEXTAUTH_URL - Your deployed domain URL
✅ BLOB_READ_WRITE_TOKEN - Vercel Blob storage token
✅ SETUP_SECRET_KEY - (Optional) For manual API setup
```

## Troubleshooting:

### Database Connection Issues:

- Verify `DATABASE_URL` is correct
- Check database provider dashboard for connection details
- Ensure database allows connections from Vercel

### Seeding Fails:

- Check Vercel build logs for errors
- Try the API setup method as backup
- Verify all environment variables are set

### Admin Login Issues:

- Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
- Check that admin user was created successfully
- Try resetting admin password via database

## Support:

If you encounter issues:

1. Check Vercel deployment logs
2. Review database provider logs
3. Use the API setup method as backup
4. Check environment variables are correct
