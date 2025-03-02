import { supabase, CoffeeExtraction } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

// Table name
const EXTRACTIONS_TABLE = "coffee_extractions";

// Get all extractions for the current user
export const getExtractions = async (): Promise<CoffeeExtraction[]> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, return empty array
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from(EXTRACTIONS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching extractions:", error);
    throw error;
  }

  return data || [];
};

// Add a new extraction
export const addExtraction = async (
  extraction: Omit<CoffeeExtraction, "id">
): Promise<CoffeeExtraction> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to add an extraction");
  }

  const newExtraction = {
    ...extraction,
    id: uuidv4(),
    user_id: userId,
  };

  const { data, error } = await supabase
    .from(EXTRACTIONS_TABLE)
    .insert([newExtraction])
    .select()
    .single();

  if (error) {
    console.error("Error adding extraction:", error);
    throw error;
  }

  return data;
};

// Update an existing extraction
export const updateExtraction = async (
  extraction: CoffeeExtraction
): Promise<CoffeeExtraction> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to update an extraction");
  }

  const { data, error } = await supabase
    .from(EXTRACTIONS_TABLE)
    .update(extraction)
    .eq("id", extraction.id)
    .eq("user_id", userId) // Ensure user can only update their own extractions
    .select()
    .single();

  if (error) {
    console.error("Error updating extraction:", error);
    throw error;
  }

  return data;
};

// Delete an extraction
export const deleteExtraction = async (id: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to delete an extraction");
  }

  const { error } = await supabase
    .from(EXTRACTIONS_TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId); // Ensure user can only delete their own extractions

  if (error) {
    console.error("Error deleting extraction:", error);
    throw error;
  }
};
