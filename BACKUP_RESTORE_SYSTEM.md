# Automatic Backup & Restore Database System

## 🎯 The Problem You Identified

You're absolutely right! The original seeding method had limitations:

- ❌ No reset capability
- ❌ No backup/restore functionality
- ❌ Data gets stuck if corrupted
- ❌ Can't easily restore to known good state

## ✅ New Solution: Smart Backup/Restore System

The new system provides **automatic backup and restore** capabilities that work in production!

## 🔄 How It Works

### 1. **Normal Mode** (Default)

```bash
npm run seed:backup-restore
```

- Creates admin user if doesn't exist
- Creates basic portfolio sections if they don't exist
- Safe for repeated runs (won't duplicate data)

### 2. **Backup Mode**

```bash
npm run backup:create
# or
BACKUP_MODE=true npm run seed:backup-restore
```

- Exports all current database content to JSON
- Saves to console output (pipe to file or copy)
- Use before major changes or deployments

### 3. **Restore Mode**

```bash
npm run restore:from-backup
# or
RESTORE_MODE=true BACKUP_DATA='{"your":"backup"}' npm run seed:backup-restore
```

- **Completely resets database**
- Restores from backup data in `BACKUP_DATA` environment variable
- Perfect for recovering from corruption

### 4. **Force Reset Mode**

```bash
npm run db:reset-and-restore
# or
FORCE_RESET=true npm run seed:backup-restore
```

- Resets everything and creates fresh default data
- Nuclear option for complete restart

## 🚀 Production Deployment Strategy

### Option A: Automatic Reset on Every Deployment

Update your `vercel.json`:

```json
{
  "buildCommand": "npm run build && FORCE_RESET=true npm run seed:backup-restore"
}
```

**Result**: Fresh database on every deployment (good for testing)

### Option B: Backup & Restore on Deployment

Update your `vercel.json`:

```json
{
  "buildCommand": "npm run build && npm run seed:backup-restore"
}
```

Set environment variable `BACKUP_DATA` with your backup JSON
**Result**: Restores your content automatically if you have a backup

### Option C: Safe Seeding (Current)

```json
{
  "buildCommand": "npm run build && npm run seed:backup-restore"
}
```

**Result**: Only creates missing data, preserves existing content

## 📦 Environment Variables for Backups

### Required (Same as before):

```env
DATABASE_URL=your_postgres_url
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
ADMIN_NAME=Your Name
NEXTAUTH_SECRET=random_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Optional (For backup/restore):

```env
BACKUP_DATA={"timestamp":"2025-06-28T...","users":[...],"sections":[...],"projects":[...],"skills":[...]}
FORCE_RESET=true        # Reset database on every deployment
RESTORE_MODE=true       # Restore from BACKUP_DATA
BACKUP_MODE=true        # Create backup (local use only)
```

## 🛠️ Usage Examples

### Local Development:

1. **Create a backup before making changes:**

   ```bash
   npm run backup:create > my-backup.json
   ```

2. **Reset and restore from backup:**

   ```bash
   # Set backup data in environment
   export BACKUP_DATA='{"your":"backup","from":"file"}'
   npm run restore:from-backup
   ```

3. **Complete reset with fresh data:**
   ```bash
   npm run db:reset-and-restore
   ```

### Production Deployment:

1. **Before deploying (backup current production):**

   - Set `BACKUP_MODE=true` in Vercel temporarily
   - Deploy once to get backup in logs
   - Copy backup JSON from deployment logs
   - Remove `BACKUP_MODE` and add `BACKUP_DATA` with your backup

2. **Deploy with automatic restore:**

   - Set `BACKUP_DATA` environment variable with your backup JSON
   - Deploy normally - it will restore your content automatically

3. **Emergency reset:**
   - Set `FORCE_RESET=true` in Vercel environment
   - Deploy to get fresh database
   - Remove the flag after deployment

## 🔧 Advanced Features

### Backup Contains:

- ✅ All users (passwords re-encrypted with current env vars)
- ✅ All portfolio sections
- ✅ All projects (with WIP settings, images, etc.)
- ✅ All skills
- ✅ Timestamps for tracking

### Smart Restoration:

- 🔄 Clears existing data safely (respects foreign keys)
- 🔐 Re-encrypts passwords with current environment variables
- 📝 Preserves all custom content you've added
- ⚡ Handles missing fields gracefully

### Production Safety:

- 🛡️ Only resets when explicitly requested
- 📋 Detailed logging of all operations
- 🔍 Validates data before restoration
- 💾 Always creates fresh admin user if restore fails

## 🎛️ Which Mode Should You Use?

### For Development:

```bash
npm run seed:backup-restore  # Safe, only adds missing data
```

### For Production (Preserve Content):

Set `BACKUP_DATA` with your backup, deploy normally

```json
{ "buildCommand": "npm run build && npm run seed:backup-restore" }
```

### For Production (Fresh Start Each Deploy):

```json
{
  "buildCommand": "npm run build && FORCE_RESET=true npm run seed:backup-restore"
}
```

### For Production (Manual Control):

Set specific environment flags in Vercel dashboard as needed

## 🚨 Important Notes

1. **BACKUP_DATA Environment Variable**: Can be very large (your entire database as JSON). Vercel supports up to 4KB per environment variable, so for large databases you might need to use external backup storage.

2. **FORCE_RESET Warning**: This **deletes everything**. Only use when you want a completely fresh start.

3. **Password Security**: Backed-up passwords are marked as `[ENCRYPTED]` and re-generated from environment variables during restore.

4. **Foreign Key Safety**: The restore process deletes data in the correct order to avoid constraint violations.

## 🔄 Migration from Old System

Your existing setup will work fine! Just update your `vercel.json` to use the new script:

```json
{
  "buildCommand": "npm run build && npm run seed:backup-restore"
}
```

This provides the same behavior as before but with backup/restore capabilities available when needed.

This system gives you **automatic deployment reset capability** while preserving the safety of your existing setup!
