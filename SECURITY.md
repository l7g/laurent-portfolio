# Security Guidelines

## 🔒 Environment Variables Security

### ✅ What's Secure:

- All sensitive data is in `.env.local` (gitignored)
- Database URLs are masked in logs (credentials hidden)
- Scripts validate environment variables before execution
- Backup files are gitignored to prevent data leaks

### ❌ Never Commit:

- `.env.local` files
- Database connection strings
- API keys, secrets, or passwords
- Database backup/export files
- Neon CLI context files (`.neon`)

## 🚀 Production Deployment Security

### Environment Variables for Vercel:

```bash
# Required in Vercel Environment Variables
DATABASE_URL="your_neon_production_url"
NEXTAUTH_SECRET="your_secure_secret"
RESEND_API_KEY="your_resend_key"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
ADMIN_PASSWORD="your_secure_admin_password"
ADMIN_EMAIL="your_admin_email"
ADMIN_NAME="Your Admin Name"
```

### Security Checklist:

- [ ] All `.env*.local` files are gitignored
- [ ] Production DATABASE_URL is set in Vercel
- [ ] NEXTAUTH_SECRET is unique and secure (32+ characters)
- [ ] Admin password is strong and unique
- [ ] API keys are environment-specific
- [ ] No hardcoded credentials in source code

## 🔧 Migration Security

### Dev to Prod Migration:

- Script validates environment variables
- Logs mask sensitive credentials
- Prevents same-database migration (data loss protection)
- Warns about production identifiers
- Backup files are automatically gitignored

### Safe Migration Commands:

```bash
# Export data (creates backup automatically)
npm run export:data

# Push dev to prod (with safety checks)
npm run deploy:push-to-prod

# Seed production (non-destructive)
npm run seed:deployment-seed
```

## 🛡️ Database Access Security

### Neon Security Features:

- SSL/TLS encryption (sslmode=require)
- Branch-based isolation
- Connection pooling
- IAM-based access control

### Best Practices:

1. Use separate Neon branches for dev/staging/prod
2. Rotate database passwords regularly
3. Monitor database access logs
4. Use connection pooling for performance and security
5. Enable RLS (Row Level Security) if needed

## 🚨 Security Incidents

### If Credentials Are Compromised:

1. Immediately rotate all affected passwords/keys
2. Check git history for accidentally committed secrets
3. Update Vercel environment variables
4. Regenerate NEXTAUTH_SECRET
5. Review database access logs

### Emergency Contacts:

- Neon Support: [Neon Console](https://console.neon.tech)
- Vercel Support: [Vercel Dashboard](https://vercel.com/dashboard)
- Resend Support: [Resend Dashboard](https://resend.com/dashboard)

## 📝 Audit Trail

### Regular Security Reviews:

- [ ] Monthly password rotation
- [ ] Quarterly access review
- [ ] Annual security audit
- [ ] Git history scan for secrets
- [ ] Dependency vulnerability scan

### Monitoring:

- Database connection logs
- Failed authentication attempts
- Unusual data access patterns
- Environment variable changes
