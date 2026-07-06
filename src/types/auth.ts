export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}