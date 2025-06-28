#!/bin/bash

# Simple backup script that creates a JSON backup of your database
# This can be run locally or in deployment

echo "🔄 Creating database backup..."

# Set environment for backup mode
export BACKUP_MODE=true

# Run the backup script and save output to file
node scripts/backup-restore-seed.js > backup-$(date +%Y%m%d-%H%M%S).json 2>&1

echo "✅ Backup created! Check the backup-*.json file"
echo "💡 To use this backup in production, copy the JSON data to BACKUP_DATA environment variable"
