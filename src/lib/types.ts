// Supplier type
export interface Supplier {
  id: string;
  created_at?: string;
  user_id?: string;
  name: string;
  website?: string;
  location?: string;
  notes?: string;
}

// Bean type
export interface Bean {
  id: string;
  created_at?: string;
  user_id?: string;
  supplier_id: string;
  name: string;
  origin?: string;
  process?: string;
  roast_level?: string;
  price?: number;
  purchase_url?: string;
  notes?: string;
}

// Brew Method type
export interface BrewMethod {
  id: string;
  created_at?: string;
  name: string;
  description?: string;
}

// Bean Rating type
export interface BeanRating {
  id: string;
  created_at?: string;
  user_id?: string;
  bean_id: string;
  brew_method_id: string;
  rating: number;
  aroma?: number;
  flavor?: number;
  aftertaste?: number;
  acidity?: number;
  body?: number;
  balance?: number;
  notes?: string;
  is_public?: boolean;
}

// Bean Comment type
export interface BeanComment {
  id: string;
  created_at?: string;
  user_id?: string;
  rating_id: string;
  comment: string;
}

// UI types with additional properties for display
export interface UISupplier extends Supplier {
  expanded?: boolean;
}

export interface UIBean extends Bean {
  expanded?: boolean;
  supplier_name?: string;
}

export interface UIBeanRating extends BeanRating {
  expanded?: boolean;
  bean_name?: string;
  brew_method_name?: string;
  user_name?: string;
  user_avatar?: string;
  comments?: UIBeanComment[];
  comment_count?: number;
  likes?: number;
}

export interface UIBeanComment extends BeanComment {
  user_name?: string;
  user_avatar?: string;
  created_at_formatted?: string;
}

// User profile type
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
}
