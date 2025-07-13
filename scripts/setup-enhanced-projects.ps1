# Enhanced Projects Setup Script for Windows PowerShell
# This script sets up the new demos and projects structure

Write-Host "🚀 Setting up Enhanced Projects & Demos Structure..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Step 1: Generate Prisma migration
Write-Host "📝 Step 1: Generating Prisma migration..." -ForegroundColor Yellow
& npx prisma migrate dev --name "add-enhanced-projects-fields"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed. Please check your database connection." -ForegroundColor Red
    exit 1
}

# Step 2: Run setup script
Write-Host ""
Write-Host "📋 Step 2: Setting up project categories..." -ForegroundColor Yellow
& node scripts/setup-enhanced-projects.js

# Step 3: Generate Prisma client
Write-Host ""
Write-Host "🔄 Step 3: Regenerating Prisma client..." -ForegroundColor Yellow
& npx prisma generate

# Step 4: Build the application
Write-Host ""
Write-Host "🏗️  Step 4: Building application..." -ForegroundColor Yellow
& npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Enhanced Projects setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit /admin to configure your demo projects" -ForegroundColor White
    Write-Host "2. Mark 3 projects as demos (demo: true)" -ForegroundColor White
    Write-Host "3. Set categories for all projects" -ForegroundColor White
    Write-Host "4. Test /demos and /projects pages" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See docs/ENHANCED_PROJECTS_GUIDE.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed. Please check for any TypeScript errors." -ForegroundColor Red
}
