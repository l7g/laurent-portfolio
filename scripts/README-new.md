# Portfolio Database Management

This directory contains the essential database management tools for the portfolio project.

## Core System

### Environment-Safe Prisma Operations

- **`safe-prisma.js`** - Main database command wrapper that handles environment switching
- **`.env.development`** - Docker database configuration
- **`.env.production`** - Neon database configuration

### Essential Scripts

- **`postinstall-db.js`** - Database setup after npm install
- **`migrate.js`** - Migration helper for development
- **`seed-production.js`** - Production data seeding
- **`seed-production-safe.js`** - Safe production seeding with verification
- **`setup-admin.cjs`** - Admin user setup
- **`generate-secret.js`** - Generate secure secrets
- **`apply-missing-fields.js`** - One-time script for production field additions

## Daily Usage

```bash
# Development (Docker)
npm run dev                                    # Start development
npm run prisma dev:migrate feature_name       # Create migration
npm run prisma dev:studio                     # View dev database

# Production (Neon)
npm run prisma prod:deploy                    # Deploy to production
npm run prisma prod:status                    # Check production status
npm run prisma prod:studio                    # View production (careful!)

# Other
npm run db:seed                               # Seed development
npm run seed:production-safe                  # Seed production safely
npm run setup:admin                          # Create admin user
```

## Key Benefits

- ✅ **No environment variable errors** - Automatic environment switching
- ✅ **30-second deployments** - Simple and fast
- ✅ **Safe operations** - Can't accidentally target wrong database
- ✅ **Standard Prisma commands** - Familiar workflow

## Documentation

- **`docs/BULLETPROOF_WORKFLOW.md`** - Complete workflow guide
- **`docs/ENHANCED_PROJECTS_GUIDE.md`** - Projects feature documentation
- **`docs/BRANCH_PROTECTION.md`** - Git workflow guidelines
