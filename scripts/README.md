# Scripts Directory

This directory contains utility scripts for managing the portfolio application.

## Data Migration Scripts

### `complete-migration.cjs`

Complete production data migration script that copies ALL data from production to local development database.

**Usage:**

```bash
node scripts/complete-migration.cjs
```

**What it migrates:**

- Projects (as personal projects, not demos)
- Skills with levels and categories
- Site settings and customizations
- Contact form submissions
- Academic programs
- User accounts

### `copy-prod-data.cjs`

Simplified script for basic project data copying. Use `complete-migration.cjs` for full migration.

## Demo Management Scripts

### `setup-demos.cjs`

Configures which projects should be displayed as demos on the homepage.

**Usage:**

```bash
# Show current setup and options
node scripts/setup-demos.cjs

# Automatically assign first 3 projects as demos
node scripts/setup-demos.cjs auto
```

**Demo System:**

- Only 3 projects are marked as demos (one per category)
- Categories: FULLSTACK, FRONTEND, BACKEND
- Demos are displayed in the "Live Demos" section on homepage
- All other projects remain as personal projects

## Environment Requirements

All scripts require these environment variables:

- `DATABASE_URL` - Local development database connection
- `PROD_DATABASE_URL` - Production database connection (for migration scripts)

## Notes

- Always backup your database before running migration scripts
- Migration scripts handle schema differences between production and development
- Demo setup can be changed anytime through the admin panel or by re-running scripts
