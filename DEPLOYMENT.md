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
