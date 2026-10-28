import api from "./axios";

export interface Wallet {
  id: number;
  user_id: number;
  balance: number | string;
}

export interface WalletHistoryItem {
  id: number;
  transaction_type: string;
  amount: number | string;
  balance_before: number | string;
  balance_after: number | string;
  description?: string;
  created_at: string;
}

export interface WalletPaymentInitialization {
  paymentReference: string;
  transactionReference: string;
  checkoutUrl: string;
}

export interface WalletPaymentVerification {
  paymentStatus: string;
  walletCredited: boolean;
}

export async function getWallet() {
  const response = await api.get<{ data: { wallet: Wallet } }>("/wallet");
  return response.data.data.wallet;
}

export async function initializeWalletPayment(amount: number) {
  const response = await api.post<{
    data: WalletPaymentInitialization;
  }>("/payments/initialize", { amount });
  return response.data.data;
}

export async function verifyWalletPayment(transactionReference: string) {
  const response = await api.get<{
    data: WalletPaymentVerification;
  }>(`/payments/verify/${encodeURIComponent(transactionReference)}`);
  return response.data.data;
}

export async function getWalletHistory() {
  const response = await api.get<{ data: { history: WalletHistoryItem[] } }>(
    "/wallet/history",
  );
  return response.data.data.history;
}
