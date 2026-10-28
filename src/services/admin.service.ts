import api from "./axios";

export interface AdminOverview {
  total_users: number;
  customers: number;
  authors: number;
  total_movies: number;
  active_rentals: number;
  total_purchases: number;
  pending_payments: number;
  successful_payments: number;
  total_wallet_funding: number | string;
  total_wallet_balance: number | string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "producer" | "admin";
  wallet_balance: number | string | null;
  created_at: string;
}

export interface AdminMovie {
  id: number;
  title: string;
  producer: string;
  description?: string | null;
  poster_url?: string | null;
  trailer_url?: string | null;
  duration?: string | null;
  genre: string | null;
  release_year: number | null;
  rental_price: number | string;
  purchase_price: number | string;
  created_at: string;
}


export interface AdminPayment {
  id: number;
  customer: string;
  payment_reference: string;
  amount: number | string;
  currency: string;
  payment_method: string | null;
  status: string;
  wallet_credited: boolean;
  created_at: string;
}

export interface AdminRental {
  id: number;
  customer: string;
  title: string;
  duration_days: number;
  expires_at: string | null;
  amount: number | string;
  status: string;
  created_at: string;
}

export interface AdminPurchase {
  id: number;
  customer: string;
  title: string;
  amount: number | string;
  payment_method: string;
  created_at: string;
}

async function getList<T>(path: string) {
  const response = await api.get<{ data: T[] }>(`/admin/${path}`);
  return response.data.data;
}

export async function getAdminOverview() {
  const response = await api.get<{ data: AdminOverview }>("/admin/overview");
  return response.data.data;
}

export const getAdminUsers = () => getList<AdminUser>("users");
export const getAdminMovies = () => getList<AdminMovie>("movies");
export const getAdminPayments = () => getList<AdminPayment>("payments");
export const getAdminRentals = () => getList<AdminRental>("rentals");
export const getAdminPurchases = () => getList<AdminPurchase>("purchases");

export async function updateAdminUserRole(
  userId: number,
  role: "customer" | "producer",
) {
  const response = await api.patch<{ data: { id: number; role: string } }>(
    `/admin/users/${userId}/role`,
    { role },
  );
  return response.data.data;
}

export interface MoviePayload {
  title: string;
  description?: string;
  genre?: string;
  duration?: string;
  release_year?: number;
  poster_url?: string;
  trailer_url?: string;
  rental_price: number;
  purchase_price: number;
}

export async function createAdminMovie(payload: MoviePayload) {
  const response = await api.post<{ data: AdminMovie }>("/admin/movies", payload);
  return response.data.data;
}

export async function updateAdminMovie(
  id: number,
  payload: Partial<MoviePayload>,
) {
  const response = await api.put<{ data: AdminMovie }>(
    `/admin/movies/${id}`,
    payload,
  );
  return response.data.data;
}

export async function deleteAdminMovie(id: number) {
  const response = await api.delete<{ message: string }>(`/admin/movies/${id}`);
  return response.data;
}

export interface WalletAdjustmentPayload {
  amount: number;
  type: "credit" | "debit";
  description: string;
}

export interface UserActivity {
  user: AdminUser;
  walletHistory: Array<{
    id: number;
    transaction_type: "credit" | "debit";
    amount: number | string;
    balance_before: number | string;
    balance_after: number | string;
    reference_id: string;
    description: string;
    created_at: string;
  }>;
  rentals: AdminRental[];
  purchases: AdminPurchase[];
}

export async function adjustAdminUserWallet(
  userId: number,
  payload: WalletAdjustmentPayload,
) {
  const response = await api.post<{
    message: string;
    data: {
      userId: number;
      amount: number;
      type: "credit" | "debit";
      balanceBefore: number;
      balanceAfter: number;
      referenceId: string;
    };
  }>(`/admin/users/${userId}/wallet-adjust`, payload);
  return response.data;
}

export async function getAdminUserActivity(userId: number) {
  const response = await api.get<{ data: UserActivity }>(
    `/admin/users/${userId}/activity`,
  );
  return response.data.data;
}


