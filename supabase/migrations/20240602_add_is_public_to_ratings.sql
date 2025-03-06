-- Add is_public column to bean_ratings table
ALTER TABLE bean_ratings ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

-- Create an index on is_public for better query performance
CREATE INDEX IF NOT EXISTS idx_bean_ratings_is_public ON bean_ratings(is_public);

-- Update existing ratings to be public by default
UPDATE bean_ratings SET is_public = TRUE WHERE is_public IS NULL; 