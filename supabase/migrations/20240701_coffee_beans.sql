-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  website TEXT,
  location TEXT,
  notes TEXT
);

-- Create beans table
CREATE TABLE IF NOT EXISTS beans (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  supplier_id UUID REFERENCES suppliers(id),
  name TEXT NOT NULL,
  origin TEXT,
  process TEXT,
  roast_level TEXT,
  price DECIMAL(10, 2),
  purchase_url TEXT,
  notes TEXT
);

-- Create brew_methods table
CREATE TABLE IF NOT EXISTS brew_methods (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT
);

-- Create bean_ratings table
CREATE TABLE IF NOT EXISTS bean_ratings (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  bean_id UUID REFERENCES beans(id),
  brew_method_id UUID REFERENCES brew_methods(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  aroma INTEGER CHECK (aroma >= 1 AND aroma <= 5),
  flavor INTEGER CHECK (flavor >= 1 AND flavor <= 5),
  aftertaste INTEGER CHECK (aftertaste >= 1 AND aftertaste <= 5),
  acidity INTEGER CHECK (acidity >= 1 AND acidity <= 5),
  body INTEGER CHECK (body >= 1 AND body <= 5),
  balance INTEGER CHECK (balance >= 1 AND balance <= 5),
  notes TEXT
);

-- Insert default brew methods
INSERT INTO brew_methods (id, name, description) VALUES 
  (gen_random_uuid(), 'Espresso', 'High-pressure extraction method using finely ground coffee'),
  (gen_random_uuid(), 'Pour Over', 'Manual brewing method where hot water is poured over ground coffee'),
  (gen_random_uuid(), 'French Press', 'Immersion brewing method using a plunger'),
  (gen_random_uuid(), 'AeroPress', 'Pressure brewing method using a plunger and paper filter'),
  (gen_random_uuid(), 'Cold Brew', 'Slow extraction method using cold water over 12-24 hours'),
  (gen_random_uuid(), 'Moka Pot', 'Stovetop brewing method using steam pressure'),
  (gen_random_uuid(), 'Chemex', 'Pour-over method using special thick filters'),
  (gen_random_uuid(), 'V60', 'Pour-over method using cone-shaped dripper'),
  (gen_random_uuid(), 'Siphon', 'Vacuum brewing method using vapor pressure and gravity')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE beans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bean_ratings ENABLE ROW LEVEL SECURITY;

-- RLS policies for suppliers
CREATE POLICY "Users can view their own suppliers" 
  ON suppliers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers" 
  ON suppliers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" 
  ON suppliers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" 
  ON suppliers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for beans
CREATE POLICY "Users can view their own beans" 
  ON beans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beans" 
  ON beans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own beans" 
  ON beans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beans" 
  ON beans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for bean_ratings
CREATE POLICY "Users can view their own bean ratings" 
  ON bean_ratings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bean ratings" 
  ON bean_ratings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bean ratings" 
  ON bean_ratings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bean ratings" 
  ON bean_ratings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS suppliers_user_id_idx ON suppliers (user_id);
CREATE INDEX IF NOT EXISTS beans_user_id_idx ON beans (user_id);
CREATE INDEX IF NOT EXISTS beans_supplier_id_idx ON beans (supplier_id);
CREATE INDEX IF NOT EXISTS bean_ratings_user_id_idx ON bean_ratings (user_id);
CREATE INDEX IF NOT EXISTS bean_ratings_bean_id_idx ON bean_ratings (bean_id);
CREATE INDEX IF NOT EXISTS bean_ratings_brew_method_id_idx ON bean_ratings (brew_method_id); 