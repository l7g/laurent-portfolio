-- Add blog series and course fields to blog_posts table
ALTER TABLE "blog_posts" 
ADD COLUMN "courseId" TEXT,
ADD COLUMN "seriesId" TEXT,
ADD COLUMN "seriesOrder" INTEGER;

-- Create blog_series table
CREATE TABLE "blog_series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "estimatedTime" INTEGER,
    "difficulty" TEXT,
    "tags" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_series_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "blog_series_slug_key" ON "blog_series"("slug");

-- Add foreign key constraints
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "blog_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "blog_series" ADD CONSTRAINT "blog_series_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
