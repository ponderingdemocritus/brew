# Supabase Database Setup

This directory contains SQL migrations for setting up the database schema for the Coffee Loaf application.

## Migrations

The migrations should be applied in the following order:

1. `20240601_profiles.sql` - Creates the profiles table and trigger
2. `20240601_bean_comments.sql` - Creates the bean_comments table and adds the is_public column to bean_ratings
3. `20240601_comment_counts.sql` - Creates the get_comment_counts function
4. `20240602_add_is_public_to_ratings.sql` - Ensures the is_public column exists on bean_ratings table

## How to Apply Migrations

### Using Supabase CLI

If you have the Supabase CLI installed, you can apply migrations with:

```bash
supabase db reset
```

### Manual Application

You can also apply these migrations manually through the Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file's contents
4. Execute the SQL statements in the order listed above

## Database Schema

### profiles

- `id` - UUID (Primary Key, references auth.users)
- `created_at` - Timestamp
- `updated_at` - Timestamp
- `username` - Text (Unique)
- `full_name` - Text
- `avatar_url` - Text
- `bio` - Text

### bean_comments

- `id` - UUID (Primary Key)
- `created_at` - Timestamp
- `user_id` - UUID (references auth.users)
- `rating_id` - UUID (references bean_ratings)
- `comment` - Text

### bean_ratings (Updated)

- Added `is_public` - Boolean (default: false)

## Functions

### get_comment_counts

- Returns comment counts for a list of rating IDs
- Parameters: `rating_ids` (UUID[])
- Returns: Table with `rating_id` (UUID) and `count` (BIGINT)
