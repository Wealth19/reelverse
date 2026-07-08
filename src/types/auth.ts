export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  status: string;
  message: string;

  data: {
    user: User;

    accessToken: string;

    refreshToken: string;

    expiresIn: string;
  };
}
