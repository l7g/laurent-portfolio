-- Migration to add related articles functionality
-- This allows bidirectional linking between blog posts

CREATE TABLE IF NOT EXISTS "blog_post_relations" (
  "id" TEXT NOT NULL,
  "sourcePostId" TEXT NOT NULL,
  "targetPostId" TEXT NOT NULL,
  "relationType" TEXT DEFAULT 'related',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" TEXT NOT NULL,

  CONSTRAINT "blog_post_relations_pkey" PRIMARY KEY ("id")
);

-- Foreign key constraints
ALTER TABLE "blog_post_relations" ADD CONSTRAINT "blog_post_relations_sourcePostId_fkey" FOREIGN KEY ("sourcePostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blog_post_relations" ADD CONSTRAINT "blog_post_relations_targetPostId_fkey" FOREIGN KEY ("targetPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "blog_post_relations" ADD CONSTRAINT "blog_post_relations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique constraint to prevent duplicate relations
CREATE UNIQUE INDEX "blog_post_relations_sourcePostId_targetPostId_key" ON "blog_post_relations"("sourcePostId", "targetPostId");

-- Index for better query performance
CREATE INDEX "blog_post_relations_sourcePostId_idx" ON "blog_post_relations"("sourcePostId");
CREATE INDEX "blog_post_relations_targetPostId_idx" ON "blog_post_relations"("targetPostId");
