import { supabase } from "../lib/supabase";
import { Supplier } from "../lib/types";
import { v4 as uuidv4 } from "uuid";

// Table name
const SUPPLIERS_TABLE = "suppliers";

// Get all suppliers for the current user
export const getSuppliers = async (): Promise<Supplier[]> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, return empty array
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from(SUPPLIERS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("name");

  if (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }

  return data || [];
};

// Get a supplier by ID
export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  const { data, error } = await supabase
    .from(SUPPLIERS_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching supplier:", error);
    throw error;
  }

  return data;
};

// Add a new supplier
export const addSupplier = async (
  supplier: Omit<Supplier, "id">
): Promise<Supplier> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to add a supplier");
  }

  const newSupplier = {
    ...supplier,
    id: uuidv4(),
    user_id: userId,
  };

  const { data, error } = await supabase
    .from(SUPPLIERS_TABLE)
    .insert([newSupplier])
    .select()
    .single();

  if (error) {
    console.error("Error adding supplier:", error);
    throw error;
  }

  return data;
};

// Update a supplier
export const updateSupplier = async (supplier: Supplier): Promise<Supplier> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to update a supplier");
  }

  const { data, error } = await supabase
    .from(SUPPLIERS_TABLE)
    .update(supplier)
    .eq("id", supplier.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating supplier:", error);
    throw error;
  }

  return data;
};

// Delete a supplier
export const deleteSupplier = async (id: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to delete a supplier");
  }

  const { error } = await supabase
    .from(SUPPLIERS_TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
};
