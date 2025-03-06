import { supabase } from "../lib/supabase";
import {
  BeanRating,
  UIBeanRating,
  BeanComment,
  UIBeanComment,
} from "../lib/types";
import { v4 as uuidv4 } from "uuid";

// Table names
const BEAN_RATINGS_TABLE = "bean_ratings";
const BEAN_COMMENTS_TABLE = "bean_comments";
const PROFILES_TABLE = "profiles";

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

// Get global public bean ratings
export const getGlobalBeanRatings = async (
  limit = 20,
  offset = 0
): Promise<UIBeanRating[]> => {
  try {
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
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching global bean ratings:", error);
      return []; // Return empty array instead of throwing
    }

    // If no data or empty array, return empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Get comment counts for each rating
    const ratingIds = data.map((rating) => rating.id);
    let commentCounts: { rating_id: string; count: string }[] = [];

    if (ratingIds.length > 0) {
      try {
        const { data: countData, error: countError } = await supabase.rpc(
          "get_comment_counts",
          { rating_ids: ratingIds }
        );

        if (!countError && countData) {
          commentCounts = countData;
        } else {
          console.error("Error fetching comment counts:", countError);
        }
      } catch (err) {
        console.error("Error calling get_comment_counts function:", err);
      }
    }

    // Get user profiles for the ratings
    const userIds = data.map((rating) => rating.user_id).filter(Boolean);
    let userProfiles: Record<
      string,
      { username?: string; avatar_url?: string }
    > = {};

    if (userIds.length > 0) {
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from(PROFILES_TABLE)
          .select("id, username, avatar_url")
          .in("id", userIds);

        if (!profilesError && profilesData) {
          userProfiles = profilesData.reduce(
            (acc, profile) => {
              acc[profile.id] = {
                username: profile.username,
                avatar_url: profile.avatar_url,
              };
              return acc;
            },
            {} as Record<string, { username?: string; avatar_url?: string }>
          );
        } else {
          console.error("Error fetching user profiles:", profilesError);
        }
      } catch (err) {
        console.error("Error fetching user profiles:", err);
      }
    }

    // Transform the data to include bean_name, brew_method_name, and user info
    return data.map((rating) => {
      const commentCount =
        commentCounts?.find(
          (count: { rating_id: string; count: string }) =>
            count.rating_id === rating.id
        )?.count || "0";

      const userProfile = rating.user_id ? userProfiles[rating.user_id] : null;

      return {
        ...rating,
        bean_name: rating.beans?.name || "Unknown Bean",
        brew_method_name: rating.brew_methods?.name || "Unknown Method",
        user_name: userProfile?.username || "Anonymous",
        user_avatar: userProfile?.avatar_url || null,
        comment_count: parseInt(commentCount),
      };
    });
  } catch (err) {
    console.error("Unexpected error in getGlobalBeanRatings:", err);
    return []; // Return empty array for any unexpected errors
  }
};

// Search global bean ratings
export const searchGlobalBeanRatings = async (
  query: string
): Promise<UIBeanRating[]> => {
  try {
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
      .eq("is_public", true)
      .or(`beans.name.ilike.%${query}%, notes.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error searching global bean ratings:", error);
      return []; // Return empty array instead of throwing
    }

    // If no data or empty array, return empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Get comment counts for each rating
    const ratingIds = data.map((rating) => rating.id);
    let commentCounts: { rating_id: string; count: string }[] = [];

    if (ratingIds.length > 0) {
      try {
        const { data: countData, error: countError } = await supabase.rpc(
          "get_comment_counts",
          { rating_ids: ratingIds }
        );

        if (!countError && countData) {
          commentCounts = countData;
        } else {
          console.error("Error fetching comment counts:", countError);
        }
      } catch (err) {
        console.error("Error calling get_comment_counts function:", err);
      }
    }

    // Get user profiles for the ratings
    const userIds = data.map((rating) => rating.user_id).filter(Boolean);
    let userProfiles: Record<
      string,
      { username?: string; avatar_url?: string }
    > = {};

    if (userIds.length > 0) {
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from(PROFILES_TABLE)
          .select("id, username, avatar_url")
          .in("id", userIds);

        if (!profilesError && profilesData) {
          userProfiles = profilesData.reduce(
            (acc, profile) => {
              acc[profile.id] = {
                username: profile.username,
                avatar_url: profile.avatar_url,
              };
              return acc;
            },
            {} as Record<string, { username?: string; avatar_url?: string }>
          );
        } else {
          console.error("Error fetching user profiles:", profilesError);
        }
      } catch (err) {
        console.error("Error fetching user profiles:", err);
      }
    }

    // Transform the data to include bean_name, brew_method_name, and user info
    return data.map((rating) => {
      const commentCount =
        commentCounts?.find(
          (count: { rating_id: string; count: string }) =>
            count.rating_id === rating.id
        )?.count || "0";

      const userProfile = rating.user_id ? userProfiles[rating.user_id] : null;

      return {
        ...rating,
        bean_name: rating.beans?.name || "Unknown Bean",
        brew_method_name: rating.brew_methods?.name || "Unknown Method",
        user_name: userProfile?.username || "Anonymous",
        user_avatar: userProfile?.avatar_url || null,
        comment_count: parseInt(commentCount),
      };
    });
  } catch (err) {
    console.error("Unexpected error in searchGlobalBeanRatings:", err);
    return []; // Return empty array for any unexpected errors
  }
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
    .eq("bean_id", beanId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bean ratings:", error);
    throw error;
  }

  return data.map((rating) => ({
    ...rating,
    bean_name: rating.beans?.name || "Unknown Bean",
    brew_method_name: rating.brew_methods?.name || "Unknown Method",
  }));
};

// Get public ratings for a specific bean
export const getPublicBeanRatingsByBean = async (
  beanId: string
): Promise<UIBeanRating[]> => {
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
    .eq("bean_id", beanId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public bean ratings by bean:", error);
    throw error;
  }

  // Get comment counts for each rating
  const ratingIds = data.map((rating) => rating.id);
  let commentCounts: { rating_id: string; count: string }[] = [];

  if (ratingIds.length > 0) {
    try {
      const { data: countData, error: countError } = await supabase.rpc(
        "get_comment_counts",
        { rating_ids: ratingIds }
      );

      if (!countError && countData) {
        commentCounts = countData;
      } else {
        console.error("Error fetching comment counts:", countError);
      }
    } catch (err) {
      console.error("Error calling get_comment_counts function:", err);
    }
  }

  // Get user profiles for the ratings
  const userIds = data.map((rating) => rating.user_id).filter(Boolean);
  let userProfiles: Record<string, { username?: string; avatar_url?: string }> =
    {};

  if (userIds.length > 0) {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from(PROFILES_TABLE)
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (!profilesError && profilesData) {
        userProfiles = profilesData.reduce(
          (acc, profile) => {
            acc[profile.id] = {
              username: profile.username,
              avatar_url: profile.avatar_url,
            };
            return acc;
          },
          {} as Record<string, { username?: string; avatar_url?: string }>
        );
      } else {
        console.error("Error fetching user profiles:", profilesError);
      }
    } catch (err) {
      console.error("Error fetching user profiles:", err);
    }
  }

  // Transform the data to include bean_name, brew_method_name, and user info
  return (data || []).map((rating) => {
    const commentCount =
      commentCounts?.find(
        (count: { rating_id: string; count: string }) =>
          count.rating_id === rating.id
      )?.count || "0";

    const userProfile = rating.user_id ? userProfiles[rating.user_id] : null;

    return {
      ...rating,
      bean_name: rating.beans?.name || "Unknown Bean",
      brew_method_name: rating.brew_methods?.name || "Unknown Method",
      user_name: userProfile?.username || "Anonymous",
      user_avatar: userProfile?.avatar_url || null,
      comment_count: parseInt(commentCount),
    };
  });
};

// Get comments for a rating
export const getCommentsForRating = async (
  ratingId: string
): Promise<UIBeanComment[]> => {
  const { data, error } = await supabase
    .from(BEAN_COMMENTS_TABLE)
    .select("*")
    .eq("rating_id", ratingId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }

  // Get user profiles for the comments
  const userIds = data.map((comment) => comment.user_id).filter(Boolean);
  let userProfiles: Record<string, { username?: string; avatar_url?: string }> =
    {};

  if (userIds.length > 0) {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from(PROFILES_TABLE)
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (!profilesError && profilesData) {
        userProfiles = profilesData.reduce(
          (acc, profile) => {
            acc[profile.id] = {
              username: profile.username,
              avatar_url: profile.avatar_url,
            };
            return acc;
          },
          {} as Record<string, { username?: string; avatar_url?: string }>
        );
      } else {
        console.error("Error fetching user profiles:", profilesError);
      }
    } catch (err) {
      console.error("Error fetching user profiles:", err);
    }
  }

  return data.map((comment) => {
    const createdAt = new Date(comment.created_at);
    const userProfile = comment.user_id ? userProfiles[comment.user_id] : null;

    return {
      ...comment,
      user_name: userProfile?.username || "Anonymous",
      user_avatar: userProfile?.avatar_url,
      created_at_formatted: createdAt.toLocaleString(),
    };
  });
};

// Add a comment to a rating
export const addComment = async (
  ratingId: string,
  commentText: string
): Promise<UIBeanComment> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to add a comment");
  }

  const newComment = {
    id: uuidv4(),
    rating_id: ratingId,
    user_id: userId,
    comment: commentText,
  };

  const { data, error } = await supabase
    .from(BEAN_COMMENTS_TABLE)
    .insert([newComment])
    .select()
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    throw error;
  }

  // Get the user profile
  let username = "Anonymous";
  let avatarUrl = null;

  try {
    const { data: profileData, error: profileError } = await supabase
      .from(PROFILES_TABLE)
      .select("username, avatar_url")
      .eq("id", userId)
      .single();

    if (!profileError && profileData) {
      username = profileData.username || "Anonymous";
      avatarUrl = profileData.avatar_url;
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }

  const createdAt = new Date(data.created_at);
  return {
    ...data,
    user_name: username,
    user_avatar: avatarUrl,
    created_at_formatted: createdAt.toLocaleString(),
  };
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  // If no user is logged in, throw error
  if (!userId) {
    throw new Error("You must be logged in to delete a comment");
  }

  const { error } = await supabase
    .from(BEAN_COMMENTS_TABLE)
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
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
