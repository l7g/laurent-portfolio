# Local Database Setup Helper
# This script checks your system and helps set up a local PostgreSQL database

Write-Host "🏠 Local Database Setup Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if Docker is available
Write-Host "`n🐳 Checking for Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
        $useDocker = $true
    } else {
        throw "Docker not found"
    }
} catch {
    Write-Host "❌ Docker not found or not running" -ForegroundColor Red
    $useDocker = $false
}

if ($useDocker) {
    Write-Host "`n🚀 Setting up Docker PostgreSQL..." -ForegroundColor Yellow
    
    # Start PostgreSQL container
    Write-Host "Starting PostgreSQL container..." -ForegroundColor White
    & docker-compose -f docker-compose.dev.yml up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL container started successfully!" -ForegroundColor Green
        
        # Wait a moment for PostgreSQL to initialize
        Write-Host "`n⏳ Waiting for PostgreSQL to initialize (30 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        # Update environment file
        Write-Host "`n📝 Updating .env.local for local database..." -ForegroundColor Yellow
        $envContent = Get-Content .env.local
        $newEnvContent = $envContent -replace '^DATABASE_URL=.*', 'DATABASE_URL="postgresql://portfolio_user:dev_password_123@localhost:5432/portfolio_dev"'
        $newEnvContent | Set-Content .env.local.backup
        $newEnvContent | Set-Content .env.local
        
        Write-Host "✅ Environment updated! (Backup saved as .env.local.backup)" -ForegroundColor Green
        
        Write-Host "`n🔄 Setting up database schema..." -ForegroundColor Yellow
        & npx prisma db push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database schema created!" -ForegroundColor Green
            
            # Ask if user wants to copy production data
            $copyData = Read-Host "`n🔄 Do you want to copy your production data to local database? (y/n)"
            if ($copyData -eq 'y' -or $copyData -eq 'Y') {
                Write-Host "`n📦 Copying production data..." -ForegroundColor Yellow
                & node scripts/copy-production-data.js
            }
            
            Write-Host "`n🎉 Local database setup complete!" -ForegroundColor Green
            Write-Host "`nYour local database is now running at:" -ForegroundColor Cyan
            Write-Host "  Host: localhost" -ForegroundColor White
            Write-Host "  Port: 5432" -ForegroundColor White
            Write-Host "  Database: portfolio_dev" -ForegroundColor White
            Write-Host "  Username: portfolio_user" -ForegroundColor White
            Write-Host "`nNext steps:" -ForegroundColor Cyan
            Write-Host "1. Run: npm run dev" -ForegroundColor White
            Write-Host "2. Visit: http://localhost:3000" -ForegroundColor White
            Write-Host "3. Set up your enhanced projects in the admin panel" -ForegroundColor White
            
        } else {
            Write-Host "❌ Failed to set up database schema" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Failed to start PostgreSQL container" -ForegroundColor Red
    }
    
} else {
    Write-Host "`n💡 Docker not available. Alternative options:" -ForegroundColor Yellow
    Write-Host "1. Install Docker Desktop: https://docs.docker.com/desktop/install/windows/" -ForegroundColor White
    Write-Host "2. Install PostgreSQL directly: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "3. Use a cloud database service temporarily" -ForegroundColor White
    Write-Host "`nSee LOCAL_DB_SETUP.md for detailed instructions" -ForegroundColor Cyan
}

Write-Host "`n📋 To stop the local database later, run:" -ForegroundColor Yellow
Write-Host "docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
