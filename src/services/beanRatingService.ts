import { supabase } from "../lib/supabase";
import { BeanRating, UIBeanRating } from "../lib/types";
import { v4 as uuidv4 } from "uuid";

// Table name
const BEAN_RATINGS_TABLE = "bean_ratings";

// Get all bean ratings for the current user
export const getBeanRatings = async (): Promise<UIBeanRating[]> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, return empty array
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from(BEAN_RATINGS_TABLE)
    .select(
      `
      *,
      beans (
        name
      ),
      brew_methods (
        name
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bean ratings:", error);
    throw error;
  }

  // Transform the data to include bean_name and brew_method_name
  return (data || []).map((rating) => ({
    ...rating,
    bean_name: rating.beans?.name || "Unknown Bean",
    brew_method_name: rating.brew_methods?.name || "Unknown Method",
  }));
};

// Get bean ratings by bean ID
export const getBeanRatingsByBean = async (
  beanId: string
): Promise<UIBeanRating[]> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, return empty array
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from(BEAN_RATINGS_TABLE)
    .select(
      `
      *,
      beans (
        name
      ),
      brew_methods (
        name
      )
    `
    )
    .eq("user_id", userId)
    .eq("bean_id", beanId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bean ratings by bean:", error);
    throw error;
  }

  // Transform the data to include bean_name and brew_method_name
  return (data || []).map((rating) => ({
    ...rating,
    bean_name: rating.beans?.name || "Unknown Bean",
    brew_method_name: rating.brew_methods?.name || "Unknown Method",
  }));
};

// Get a bean rating by ID
export const getBeanRatingById = async (
  id: string
): Promise<UIBeanRating | null> => {
  const { data, error } = await supabase
    .from(BEAN_RATINGS_TABLE)
    .select(
      `
      *,
      beans (
        name
      ),
      brew_methods (
        name
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching bean rating:", error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    bean_name: data.beans?.name || "Unknown Bean",
    brew_method_name: data.brew_methods?.name || "Unknown Method",
  };
};

// Add a new bean rating
export const addBeanRating = async (
  rating: Omit<BeanRating, "id">
): Promise<BeanRating> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to add a bean rating");
  }

  const newRating = {
    ...rating,
    id: uuidv4(),
    user_id: userId,
  };

  const { data, error } = await supabase
    .from(BEAN_RATINGS_TABLE)
    .insert([newRating])
    .select()
    .single();

  if (error) {
    console.error("Error adding bean rating:", error);
    throw error;
  }

  return data;
};

// Update a bean rating
export const updateBeanRating = async (
  rating: BeanRating
): Promise<BeanRating> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to update a bean rating");
  }

  const { data, error } = await supabase
    .from(BEAN_RATINGS_TABLE)
    .update(rating)
    .eq("id", rating.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating bean rating:", error);
    throw error;
  }

  return data;
};

// Delete a bean rating
export const deleteBeanRating = async (id: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to delete a bean rating");
  }

  const { error } = await supabase
    .from(BEAN_RATINGS_TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting bean rating:", error);
    throw error;
  }
};

// Get average rating for a bean
export const getAverageRatingForBean = async (
  beanId: string
): Promise<number | null> => {
  const { data, error } = await supabase
    .from(BEAN_RATINGS_TABLE)
    .select("rating")
    .eq("bean_id", beanId);

  if (error) {
    console.error("Error fetching average rating:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / data.length;
};
