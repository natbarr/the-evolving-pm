-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  url TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  format TEXT NOT NULL,
  content_type TEXT NOT NULL,
  access_type TEXT NOT NULL DEFAULT 'free',
  summary TEXT NOT NULL,
  author TEXT,
  source TEXT,
  publication_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  confidence INTEGER NOT NULL DEFAULT 4,
  date_evaluated TIMESTAMPTZ DEFAULT NOW(),
  last_verified TIMESTAMPTZ DEFAULT NOW(),
  next_review DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_level ON resources(level);
CREATE INDEX idx_resources_format ON resources(format);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  submitted_by_email TEXT,
  context TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

-- Categories table for editorial framing
CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER
);

-- Seed default categories
INSERT INTO categories (slug, name, description, display_order) VALUES
  ('ai-fundamentals', 'AI Fundamentals', 'Core concepts of artificial intelligence, machine learning, and large language models that every PM should understand.', 1),
  ('prompt-engineering', 'Prompt Engineering', 'Techniques for crafting effective prompts to get the best results from AI systems.', 2),
  ('technical-skills', 'Technical Skills', 'Hands-on skills for working with AI tools, APIs, and development workflows.', 3),
  ('strategy-leadership', 'Strategy & Leadership', 'How to lead AI product initiatives, build AI strategy, and drive organizational change.', 4),
  ('ethics-governance', 'Ethics & Governance', 'Responsible AI practices, bias mitigation, privacy considerations, and regulatory compliance.', 5),
  ('career-development', 'Career Development', 'Growing your career as an AI-savvy product manager in a rapidly evolving landscape.', 6),
  ('tools-workflows', 'Tools & Workflows', 'Practical tools and workflows for integrating AI into your daily product management work.', 7),
  ('case-studies', 'Case Studies', 'Real-world examples of AI product launches, pivots, and lessons learned.', 8);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to resources table
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access for resources (active only)
CREATE POLICY "Public can view active resources" ON resources
  FOR SELECT USING (status = 'active');

-- Public can insert submissions
CREATE POLICY "Public can insert submissions" ON submissions
  FOR INSERT WITH CHECK (true);

-- Public can view categories
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);
