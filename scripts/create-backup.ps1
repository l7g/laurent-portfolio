# PowerShell script for creating database backup

Write-Host "🔄 Creating database backup..." -ForegroundColor Cyan

# Create timestamp
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Run the backup script using npm (cross-platform)
npm run backup:create | Out-File -FilePath "backup-$timestamp.json" -Encoding utf8

Write-Host "✅ Backup created! Check the backup-$timestamp.json file" -ForegroundColor Green
Write-Host "💡 To use this backup in production, copy the JSON data to BACKUP_DATA environment variable" -ForegroundColor Yellow

# Keep window open
Read-Host "Press Enter to continue..."
