-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT
);

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view all profiles
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;

-- Create the trigger
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_user(); 