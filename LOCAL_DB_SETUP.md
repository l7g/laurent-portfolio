# Local Development Database Setup Guide

## 🐳 **Option 1: Docker PostgreSQL (Recommended)**

### Prerequisites:

- Install Docker Desktop for Windows
- Download from: https://docs.docker.com/desktop/install/windows/

### Setup Steps:

1. **Start the local database:**

   ```powershell
   # Navigate to your project directory
   cd "c:\Users\laure\Desktop\Projs\Portfoliov2\portfolio"

   # Start PostgreSQL container
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Update your .env.local:**

   ```bash
   # Replace your DATABASE_URL with local connection
   DATABASE_URL="postgresql://portfolio_user:dev_password_123@localhost:5432/portfolio_dev"
   ```

3. **Initialize the database:**

   ```powershell
   # Push your current schema to local DB
   npx prisma db push

   # Seed with your existing data
   npm run db:seed
   ```

4. **Verify connection:**
   ```powershell
   npx prisma studio
   ```

---

## 💻 **Option 2: Local PostgreSQL Installation**

### Install PostgreSQL directly on Windows:

1. **Download PostgreSQL:**

   - Go to https://www.postgresql.org/download/windows/
   - Download and install PostgreSQL 15+

2. **Create development database:**

   ```sql
   -- Connect with pgAdmin or psql
   CREATE DATABASE portfolio_dev;
   CREATE USER portfolio_user WITH PASSWORD 'dev_password_123';
   GRANT ALL PRIVILEGES ON DATABASE portfolio_dev TO portfolio_user;
   ```

3. **Update .env.local:**
   ```bash
   DATABASE_URL="postgresql://portfolio_user:dev_password_123@localhost:5432/portfolio_dev"
   ```

---

## 🔄 **Migration Strategy**

### Copy Production Data to Local:

1. **Export from production:**

   ```powershell
   # Export schema and data from your Neon DB
   npx prisma db pull --url="your-neon-production-url"
   ```

2. **Import to local:**
   ```powershell
   # Apply to local database
   npx prisma db push
   npx prisma db seed
   ```

---

## 🎯 **Benefits of Local DB:**

✅ **No compute limits** - Run migrations and experiments freely
✅ **Faster development** - No network latency
✅ **Offline work** - Develop without internet
✅ **Easy reset** - Quickly reset/rebuild database
✅ **Cost effective** - No cloud database costs during development

---

## 🔧 **Enhanced Projects Setup with Local DB:**

Once your local database is running:

```powershell
# 1. Apply the enhanced projects schema
npx prisma migrate dev --name "add-enhanced-projects-fields"

# 2. Seed with demo data
node scripts/setup-enhanced-projects.js

# 3. Test the new features
npm run dev
```

---

## 🚀 **Quick Start Commands:**

```powershell
# Start local database (Docker)
docker-compose -f docker-compose.dev.yml up -d

# Setup enhanced projects
npx prisma db push
node scripts/setup-enhanced-projects.js

# Start development
npm run dev

# Stop database when done
docker-compose -f docker-compose.dev.yml down
```

---

Would you like me to help you set up the Docker option? It's the quickest way to get a local PostgreSQL database running!
