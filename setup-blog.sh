#!/bin/bash

# Blog System Quick Setup Script

echo "🚀 Setting up Blog System..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local with your actual database credentials"
    echo "   Example: DATABASE_URL=\"postgresql://username:password@localhost:5432/your_db\""
    echo ""
fi

# Generate NextAuth secret if not exists
if ! grep -q "NEXTAUTH_SECRET=" .env.local; then
    echo "🔐 Generating NextAuth secret..."
    SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env.local
    echo "✅ NextAuth secret generated"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=\"\[" .env.local; then
    echo "❌ DATABASE_URL is not configured in .env.local"
    echo "Please configure your database connection string:"
    echo "  For Supabase: DATABASE_URL=\"postgresql://postgres:password@your-project.supabase.co:5432/postgres\""
    echo "  For Local: DATABASE_URL=\"postgresql://username:password@localhost:5432/your_db\""
    echo ""
    echo "Then run: npm run db:migrate"
    exit 1
fi

# Run migration
echo "🗄️  Running database migration..."
npx prisma migrate dev --name add_blog_enhancements

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
npx prisma generate

# Seed database (optional)
echo "🌱 Would you like to seed the database with sample data? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    npx prisma db seed
    echo "✅ Database seeded with sample data"
fi

echo ""
echo "🎉 Blog system setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Visit http://localhost:3000/admin/blog to manage your blog"
echo "3. Visit http://localhost:3000/blog to view your blog"
echo ""
echo "For more information, see BLOG_SETUP_GUIDE.md"
