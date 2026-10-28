import api from "./axios";
import type { PayoutRequest, ProducerFinancials } from "@/types/movie";

export interface PayoutHistoryResponse {
  financials: ProducerFinancials;
  requests: PayoutRequest[];
}

export async function getMyPayouts(): Promise<PayoutHistoryResponse> {
  const response = await api.get<{ data: PayoutHistoryResponse }>(
    "/payouts/mine",
  );
  return response.data.data;
}

export async function requestPayout(payload: {
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  notes?: string;
}): Promise<{ request: PayoutRequest; financials: ProducerFinancials }> {
  const response = await api.post("/payouts", payload);
  return response.data.data;
}

