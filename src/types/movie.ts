export interface Movie {
  id: number;
  title: string;
  description?: string | null;
  year?: number;
  rating?: number;
  genre?: string;
  duration?: string;
  image?: string;
  trailer_url?: string | null;
  rental_price: number;
  purchase_price: number;
  producer?: string;
  created_at?: string;
  rental_count?: number;
  active_rentals?: number;
  purchase_count?: number;
  views_count?: number;
  rental_revenue?: number;
  purchase_revenue?: number;
  total_revenue?: number;
  avg_rating?: number;
  reviews_count?: number;
}

export interface Rental {
  id: number;
  movie_id: number;
  title: string;
  description?: string | null;
  duration_days: number;
  expires_at: string;
  amount: number;
  created_at: string;
  status: "active" | "expired" | "unknown";
  producer?: string;
  rental_price?: number;
  purchase_price?: number;
  image?: string;
  genre?: string;
}

export interface Purchase {
  id: number;
  movie_id: number;
  title: string;
  description?: string | null;
  amount: number;
  payment_method: string;
  created_at: string;
  producer?: string;
  image?: string;
  genre?: string;
}

export interface Review {
  id: number;
  movie_id: number;
  user_id: number;
  rating: number;
  comment?: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
}

export interface PayoutRequest {
  id: number;
  user_id: number;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: "pending" | "approved" | "rejected";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProducerFinancials {
  totalEarned: number;
  totalPaidOut: number;
  totalPending: number;
  availableBalance: number;
}
