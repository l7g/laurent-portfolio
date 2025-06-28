@echo off
REM Windows batch script for creating database backup

echo 🔄 Creating database backup...

REM Create timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,8%-%datetime:~8,6%

REM Run the backup script using npm (cross-platform)
npm run backup:create > backup-%timestamp%.json 2>&1

echo ✅ Backup created! Check the backup-%timestamp%.json file
echo 💡 To use this backup in production, copy the JSON data to BACKUP_DATA environment variable
pause
