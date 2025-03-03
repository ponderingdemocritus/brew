import { supabase } from "../lib/supabase";
import { Bean, UIBean } from "../lib/types";
import { v4 as uuidv4 } from "uuid";

// Table name
const BEANS_TABLE = "beans";

// Get all beans for the current user
export const getBeans = async (): Promise<UIBean[]> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, return empty array
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from(BEANS_TABLE)
    .select(
      `
      *,
      suppliers (
        name
      )
    `
    )
    .eq("user_id", userId)
    .order("name");

  if (error) {
    console.error("Error fetching beans:", error);
    throw error;
  }

  // Transform the data to include supplier_name
  return (data || []).map((bean) => ({
    ...bean,
    supplier_name: bean.suppliers?.name || "Unknown Supplier",
  }));
};

// Get beans by supplier ID
export const getBeansBySupplier = async (
  supplierId: string
): Promise<UIBean[]> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, return empty array
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from(BEANS_TABLE)
    .select(
      `
      *,
      suppliers (
        name
      )
    `
    )
    .eq("user_id", userId)
    .eq("supplier_id", supplierId)
    .order("name");

  if (error) {
    console.error("Error fetching beans by supplier:", error);
    throw error;
  }

  // Transform the data to include supplier_name
  return (data || []).map((bean) => ({
    ...bean,
    supplier_name: bean.suppliers?.name || "Unknown Supplier",
  }));
};

// Get a bean by ID
export const getBeanById = async (id: string): Promise<UIBean | null> => {
  const { data, error } = await supabase
    .from(BEANS_TABLE)
    .select(
      `
      *,
      suppliers (
        name
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching bean:", error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    supplier_name: data.suppliers?.name || "Unknown Supplier",
  };
};

// Add a new bean
export const addBean = async (bean: Omit<Bean, "id">): Promise<Bean> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to add a bean");
  }

  const newBean = {
    ...bean,
    id: uuidv4(),
    user_id: userId,
  };

  const { data, error } = await supabase
    .from(BEANS_TABLE)
    .insert([newBean])
    .select()
    .single();

  if (error) {
    console.error("Error adding bean:", error);
    throw error;
  }

  return data;
};

// Update a bean
export const updateBean = async (bean: Bean): Promise<Bean> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to update a bean");
  }

  const { data, error } = await supabase
    .from(BEANS_TABLE)
    .update(bean)
    .eq("id", bean.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating bean:", error);
    throw error;
  }

  return data;
};

// Delete a bean
export const deleteBean = async (id: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to delete a bean");
  }

  const { error } = await supabase
    .from(BEANS_TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting bean:", error);
    throw error;
  }
};
