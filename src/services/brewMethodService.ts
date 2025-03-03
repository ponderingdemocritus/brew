import { supabase } from "../lib/supabase";
import { BrewMethod } from "../lib/types";

// Table name
const BREW_METHODS_TABLE = "brew_methods";

// Get all brew methods
export const getBrewMethods = async (): Promise<BrewMethod[]> => {
  const { data, error } = await supabase
    .from(BREW_METHODS_TABLE)
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching brew methods:", error);
    throw error;
  }

  return data || [];
};

// Get a brew method by ID
export const getBrewMethodById = async (
  id: string
): Promise<BrewMethod | null> => {
  const { data, error } = await supabase
    .from(BREW_METHODS_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching brew method:", error);
    throw error;
  }

  return data;
};
