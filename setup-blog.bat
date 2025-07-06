@echo off
echo 🚀 Setting up Blog System...

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local from template...
    copy .env.local.example .env.local
    echo ⚠️  Please edit .env.local with your actual database credentials
    echo    Example: DATABASE_URL="postgresql://username:password@localhost:5432/your_db"
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if DATABASE_URL is configured
findstr /C:"DATABASE_URL=\"[" .env.local >nul
if %errorlevel% == 0 (
    echo ❌ DATABASE_URL is not configured in .env.local
    echo Please configure your database connection string:
    echo   For Supabase: DATABASE_URL="postgresql://postgres:password@your-project.supabase.co:5432/postgres"
    echo   For Local: DATABASE_URL="postgresql://username:password@localhost:5432/your_db"
    echo.
    echo Then run: npm run db:migrate
    pause
    exit /b 1
)

REM Run migration
echo 🗄️  Running database migration...
npx prisma migrate dev --name add_blog_enhancements

REM Generate Prisma client
echo ⚙️  Generating Prisma client...
npx prisma generate

REM Seed database (optional)
echo 🌱 Would you like to seed the database with sample data? (y/n)
set /p response=
if /i "%response%"=="y" (
    npx prisma db seed
    echo ✅ Database seeded with sample data
)

echo.
echo 🎉 Blog system setup complete!
echo.
echo Next steps:
echo 1. Start the development server: npm run dev
echo 2. Visit http://localhost:3000/admin/blog to manage your blog
echo 3. Visit http://localhost:3000/blog to view your blog
echo.
echo For more information, see BLOG_SETUP_GUIDE.md
pause
