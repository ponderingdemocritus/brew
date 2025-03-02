import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definition for our coffee extraction table
export type CoffeeExtraction = {
  id: string;
  created_at?: string;
  user_id?: string;
  date: string;
  bean_name: string;
  bean_price: number;
  coffee_weight: number;
  water_weight: number;
  grind_size: string;
  brew_time: string;
  temperature: number;
  rating: number;
  notes: string;
};
