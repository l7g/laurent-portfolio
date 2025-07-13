#!/bin/bash

# Enhanced Projects Setup Script
# This script sets up the new demos and projects structure

echo "🚀 Setting up Enhanced Projects & Demos Structure..."
echo "================================================"

# Step 1: Generate Prisma migration
echo "📝 Step 1: Generating Prisma migration..."
npx prisma migrate dev --name "add-enhanced-projects-fields"

if [ $? -eq 0 ]; then
    echo "✅ Migration successful!"
else
    echo "❌ Migration failed. Please check your database connection."
    exit 1
fi

# Step 2: Run setup script
echo ""
echo "📋 Step 2: Setting up project categories..."
node scripts/setup-enhanced-projects.js

# Step 3: Generate Prisma client
echo ""
echo "🔄 Step 3: Regenerating Prisma client..."
npx prisma generate

# Step 4: Build the application
echo ""
echo "🏗️  Step 4: Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Enhanced Projects setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Visit /admin to configure your demo projects"
    echo "2. Mark 3 projects as demos (demo: true)"
    echo "3. Set categories for all projects"
    echo "4. Test /demos and /projects pages"
    echo ""
    echo "📖 See docs/ENHANCED_PROJECTS_GUIDE.md for detailed instructions"
else
    echo "❌ Build failed. Please check for any TypeScript errors."
fi
