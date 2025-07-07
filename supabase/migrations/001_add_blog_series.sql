-- Add blog_series table and update blog_posts table
BEGIN;

-- Create blog_series table
CREATE TABLE IF NOT EXISTS blog_series (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  author_id TEXT NOT NULL,
  total_posts INTEGER DEFAULT 0,
  estimated_time INTEGER,
  difficulty TEXT,
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_blog_series_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add series-related columns to blog_posts if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'series_id') THEN
        ALTER TABLE blog_posts ADD COLUMN series_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'series_order') THEN
        ALTER TABLE blog_posts ADD COLUMN series_order INTEGER;
    END IF;
END $$;

-- Add foreign key constraint for series_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_blog_posts_series') THEN
        ALTER TABLE blog_posts 
        ADD CONSTRAINT fk_blog_posts_series 
        FOREIGN KEY (series_id) REFERENCES blog_series(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_series_slug ON blog_series(slug);
CREATE INDEX IF NOT EXISTS idx_blog_series_author ON blog_series(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_series_active ON blog_series(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_series ON blog_posts(series_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_series_order ON blog_posts(series_id, series_order);

-- Create updated_at trigger for blog_series
CREATE OR REPLACE FUNCTION update_blog_series_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_series_updated_at
    BEFORE UPDATE ON blog_series
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_series_updated_at();

-- Enable RLS on blog_series table
ALTER TABLE blog_series ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_series
CREATE POLICY "Allow public read access to active blog series" 
ON blog_series FOR SELECT 
TO public 
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage blog series" 
ON blog_series FOR ALL 
TO authenticated 
USING (true);

COMMIT;
