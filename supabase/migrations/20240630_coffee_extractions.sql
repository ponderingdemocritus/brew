-- Create coffee_extractions table
CREATE TABLE IF NOT EXISTS coffee_extractions (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  bean_name TEXT NOT NULL,
  bean_price DECIMAL(10, 2) NOT NULL,
  coffee_weight DECIMAL(10, 2) NOT NULL,
  water_weight DECIMAL(10, 2) NOT NULL,
  grind_size TEXT NOT NULL,
  brew_time TEXT NOT NULL,
  temperature DECIMAL(5, 2) NOT NULL,
  rating INTEGER NOT NULL,
  notes TEXT
);

-- Create RLS policies
ALTER TABLE coffee_extractions ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own extractions
CREATE POLICY "Users can view their own extractions" 
  ON coffee_extractions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own extractions
CREATE POLICY "Users can insert their own extractions" 
  ON coffee_extractions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own extractions
CREATE POLICY "Users can update their own extractions" 
  ON coffee_extractions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own extractions
CREATE POLICY "Users can delete their own extractions" 
  ON coffee_extractions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS coffee_extractions_user_id_idx ON coffee_extractions (user_id);
CREATE INDEX IF NOT EXISTS coffee_extractions_date_idx ON coffee_extractions (date); 