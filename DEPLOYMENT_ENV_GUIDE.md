# Production Environment Variables Guide

## Required Environment Variables for Deployment

### Core NextAuth Configuration

```bash
# CRITICAL: Generate a strong secret and keep it consistent across environments
# Use this command to generate: `openssl rand -base64 32`
NEXTAUTH_SECRET="your-generated-32-character-secret-here"

# Environment-specific URLs
NEXTAUTH_URL="https://yourdomain.com"  # Your actual domain
```

### Database

```bash
DATABASE_URL="your-production-database-url"
```

### Email Configuration

```bash
RESEND_API_KEY="your-resend-api-key"
NEXT_PUBLIC_CONTACT_EMAIL="contact@yourdomain.com"
RESEND_FROM_EMAIL="contact@mail.yourdomain.com"
RESEND_NOREPLY_EMAIL="noreply@mail.yourdomain.com"
```

### Application URLs

```bash
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## ⚠️ IMPORTANT SECURITY NOTES

### 1. NEXTAUTH_SECRET Must Be Consistent

- Generate once using: `openssl rand -base64 32`
- Use the SAME secret in development and production
- Never change it after users are created
- Store securely in your deployment platform

### 2. Password Hash Compatibility

- Admin passwords are hashed with bcrypt
- Hashes are tied to the user record, not the NEXTAUTH_SECRET
- Changing NEXTAUTH_SECRET won't affect password login
- But it WILL invalidate existing sessions

### 3. Deployment Platform Configuration

#### For Vercel:

```bash
# Add these in Vercel Dashboard > Project > Settings > Environment Variables
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://yourdomain.vercel.app
DATABASE_URL=your-production-database-url
RESEND_API_KEY=your-resend-api-key
# ... other variables
```

#### For Netlify:

```bash
# Add these in Netlify Dashboard > Site Settings > Environment Variables
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://yourdomain.netlify.app
# ... other variables
```

## 🔐 Recommended NEXTAUTH_SECRET Generation

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```javascript
require("crypto").randomBytes(32).toString("base64");
```

## ✅ Deployment Checklist

1. [ ] Generate a strong NEXTAUTH_SECRET
2. [ ] Set NEXTAUTH_URL to production domain
3. [ ] Configure production database URL
4. [ ] Set up email service credentials
5. [ ] Test admin login after deployment
6. [ ] Verify session persistence
7. [ ] Test password authentication

## 🚨 What NOT to Do

- ❌ Don't change NEXTAUTH_SECRET after deployment
- ❌ Don't use weak or default secrets
- ❌ Don't expose secrets in client-side code
- ❌ Don't commit secrets to version control
