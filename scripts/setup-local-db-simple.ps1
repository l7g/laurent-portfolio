# Simple Local Database Setup Script
# This script sets up PostgreSQL and initializes your database

Write-Host "Setting up Local PostgreSQL Database" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Step 1: Start PostgreSQL container
Write-Host "`nStarting PostgreSQL container..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "PostgreSQL container started!" -ForegroundColor Green
    
    # Step 2: Wait for PostgreSQL to be ready
    Write-Host "`nWaiting for PostgreSQL to initialize (45 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 45
    
    # Step 3: Test connection
    Write-Host "`nTesting database connection..." -ForegroundColor Yellow
    $testResult = docker exec portfolio-dev-db pg_isready -U portfolio_user -d portfolio_dev
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database connection successful!" -ForegroundColor Green
        
        # Step 4: Update .env.local file
        Write-Host "`nUpdating .env.local for local database..." -ForegroundColor Yellow
        
        # Read current .env.local
        $envPath = ".env.local"
        if (Test-Path $envPath) {
            # Create backup
            Copy-Item $envPath "$envPath.backup"
            
            # Update DATABASE_URL
            $content = Get-Content $envPath
            $newContent = $content -replace '^DATABASE_URL=.*', 'DATABASE_URL="postgresql://portfolio_user:dev_password_123@localhost:5432/portfolio_dev"'
            $newContent | Set-Content $envPath
            
            Write-Host "Environment file updated!" -ForegroundColor Green
            Write-Host "(Backup saved as .env.local.backup)" -ForegroundColor Gray
        } else {
            Write-Host ".env.local file not found!" -ForegroundColor Red
            Write-Host "Please create .env.local with DATABASE_URL setting" -ForegroundColor Yellow
        }
        
        Write-Host "`nLocal database setup complete!" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor Cyan
        Write-Host "1. Open a NEW PowerShell window" -ForegroundColor White
        Write-Host "2. Run: npx prisma db push" -ForegroundColor White
        Write-Host "3. Run: npm run dev" -ForegroundColor White
        Write-Host "4. Visit: http://localhost:3000" -ForegroundColor White
        
    } else {
        Write-Host "Database connection failed!" -ForegroundColor Red
        Write-Host "The container might need more time to initialize." -ForegroundColor Yellow
        Write-Host "Try running: docker logs portfolio-dev-db" -ForegroundColor White
    }
    
} else {
    Write-Host "Failed to start PostgreSQL container!" -ForegroundColor Red
    Write-Host "Make sure Docker Desktop is running." -ForegroundColor Yellow
}

Write-Host "`nManagement commands:" -ForegroundColor Cyan
Write-Host "Stop database: docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
Write-Host "View logs: docker logs portfolio-dev-db" -ForegroundColor White
Write-Host "Check status: docker ps" -ForegroundColor White
