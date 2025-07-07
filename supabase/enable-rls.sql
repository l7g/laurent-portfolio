-- Enable RLS on all tables and create appropriate policies for a portfolio site
-- This script will be run via Supabase SQL Editor or migration

-- Enable RLS on all tables
ALTER TABLE public.academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_progressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (for portfolio content)
-- These allow anyone to read public portfolio data

-- Projects: Public read access
CREATE POLICY "Anyone can read active projects" ON public.projects
  FOR SELECT USING (true);

-- Blog posts: Public read access
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (true);

-- Blog categories: Public read access
CREATE POLICY "Anyone can read blog categories" ON public.blog_categories
  FOR SELECT USING (true);

-- Skills: Public read access
CREATE POLICY "Anyone can read skills" ON public.skills
  FOR SELECT USING (true);

-- Skill progressions: Public read access
CREATE POLICY "Anyone can read skill progressions" ON public.skill_progressions
  FOR SELECT USING (true);

-- Academic programs: Public read access
CREATE POLICY "Anyone can read academic programs" ON public.academic_programs
  FOR SELECT USING (true);

-- Courses: Public read access
CREATE POLICY "Anyone can read courses" ON public.courses
  FOR SELECT USING (true);

-- Course assessments: Public read access
CREATE POLICY "Anyone can read course assessments" ON public.course_assessments
  FOR SELECT USING (true);

-- Portfolio pages: Public read access
CREATE POLICY "Anyone can read portfolio pages" ON public.portfolio_pages
  FOR SELECT USING (true);

-- Portfolio sections: Public read access
CREATE POLICY "Anyone can read portfolio sections" ON public.portfolio_sections
  FOR SELECT USING (true);

-- Site settings: Public read access for public settings
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT USING (true);

-- PRIVATE/RESTRICTED POLICIES

-- Users: Only allow reading your own user data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id::uuid);

-- Admin users can read all users (if you have admin authentication)
CREATE POLICY "Admin can read all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Contacts: Only allow inserting (for contact form submissions)
CREATE POLICY "Anyone can insert contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);

-- Admin can read all contacts
CREATE POLICY "Admin can read contacts" ON public.contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Demo requests: Only allow inserting
CREATE POLICY "Anyone can insert demo requests" ON public.demo_requests
  FOR INSERT WITH CHECK (true);

-- Admin can read all demo requests
CREATE POLICY "Admin can read demo requests" ON public.demo_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Blog comments: Allow inserting, but restrict reading
CREATE POLICY "Anyone can insert blog comments" ON public.blog_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read approved blog comments" ON public.blog_comments
  FOR SELECT USING (true); -- You can add approval logic later

-- ADMIN WRITE POLICIES
-- Allow admin users to modify content

CREATE POLICY "Admin can modify projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can modify blog posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can modify skills" ON public.skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can modify site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Continue with other admin policies...
CREATE POLICY "Admin can modify academic programs" ON public.academic_programs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can modify courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can modify portfolio content" ON public.portfolio_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admin can modify portfolio sections" ON public.portfolio_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Enable service role bypass for migrations and system operations
-- This allows your server-side code to work properly
-- Note: This is handled automatically by Supabase for service_role connections
