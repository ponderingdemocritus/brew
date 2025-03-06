-- Create bean_comments table
CREATE TABLE IF NOT EXISTS bean_comments (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating_id UUID REFERENCES bean_ratings(id) ON DELETE CASCADE,
  comment TEXT NOT NULL
);

-- Add RLS policies
ALTER TABLE bean_comments ENABLE ROW LEVEL SECURITY;

-- Allow users to view all comments
CREATE POLICY "Anyone can view comments" ON bean_comments
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own comments
CREATE POLICY "Users can insert their own comments" ON bean_comments
  FOR INSERT TO authenticated USING (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments" ON bean_comments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" ON bean_comments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add is_public column to bean_ratings if it doesn't exist
ALTER TABLE bean_ratings ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bean_comments_rating_id ON bean_comments(rating_id);
CREATE INDEX IF NOT EXISTS idx_bean_comments_user_id ON bean_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_bean_ratings_is_public ON bean_ratings(is_public); 