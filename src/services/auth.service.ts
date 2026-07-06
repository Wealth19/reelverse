import api from "@/lib/api";
import { LoginPayload, RegisterPayload } from "@/types/auth";

export async function login(data: LoginPayload) {
  return api.post("/auth/login", data);
}

export async function register(data: RegisterPayload) {
  return api.post("/auth/register", data);
}