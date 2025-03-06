#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your .env file.");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to migration file
const migrationPath = path.join(
  __dirname,
  "../supabase/migrations/20240601_bean_comments.sql"
);

// Read migration file
const migrationSQL = fs.readFileSync(migrationPath, "utf8");

async function runMigration() {
  console.log("Running migration...");

  try {
    // Execute SQL
    const { error } = await supabase.rpc("pgmigrate", { query: migrationSQL });

    if (error) {
      console.error("Error running migration:", error);
      process.exit(1);
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Error running migration:", err);
    console.log(
      "\nAlternative: You can run this SQL directly in the Supabase SQL Editor:"
    );
    console.log(migrationSQL);
    process.exit(1);
  }
}

runMigration();
