-- Add likes column to blog_comments table
ALTER TABLE blog_comments ADD COLUMN likes INTEGER NOT NULL DEFAULT 0;
