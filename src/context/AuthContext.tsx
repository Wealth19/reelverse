"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { logout as logoutRequest } from "@/services/auth.service";

interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "producer" | "admin";
}

interface AuthContextType {
  user: User | null;

  accessToken: string | null;

  login: (user: User, accessToken: string) => void;

  updateUser: (user: User) => void;

  updateTokens: (accessToken: string) => void;

  logout: () => Promise<void>;

  isAuthenticated: boolean;

  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | RESTORE AUTHENTICATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedUser && storedAccessToken) {
      try {
        const parsedUser: User = JSON.parse(storedUser);

        setUser(parsedUser);
        setAccessToken(storedAccessToken);
      } catch (error) {
        console.error("Failed to restore authentication:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        setUser(null);
        setAccessToken(null);
      }
    }

    setLoading(false);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LISTEN FOR TOKEN REFRESH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<{
        accessToken: string;
      }>;

      const newAccessToken = customEvent.detail?.accessToken;

      if (!newAccessToken) {
        return;
      }

      setAccessToken(newAccessToken);
    };

    window.addEventListener("auth:token-refreshed", handleTokenRefresh);

    return () => {
      window.removeEventListener("auth:token-refreshed", handleTokenRefresh);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LISTEN FOR AUTOMATIC LOGOUT
  |--------------------------------------------------------------------------
  |
  | Axios dispatches this when refresh fails.
  |
  */

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  |
  | Access token → localStorage
  |
  | Refresh token → HttpOnly cookie
  |
  */

  const login = (user: User, newAccessToken: string) => {
    localStorage.setItem("user", JSON.stringify(user));

    localStorage.setItem("accessToken", newAccessToken);

    setUser(user);
    setAccessToken(newAccessToken);
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE ACCESS TOKEN
  |--------------------------------------------------------------------------
  */

  const updateTokens = (newAccessToken: string) => {
    localStorage.setItem("accessToken", newAccessToken);

    setAccessToken(newAccessToken);
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE USER
  |--------------------------------------------------------------------------
  */

  const updateUser = (updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setUser(updatedUser);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  |
  | 1. Tell backend to clear HttpOnly refresh cookie.
  | 2. Clear frontend authentication state.
  |
  */

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      setUser(null);
      setAccessToken(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PROVIDER
  |--------------------------------------------------------------------------
  */

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        updateUser,
        updateTokens,
        logout,
        isAuthenticated: !!user && !!accessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| USE AUTH
|--------------------------------------------------------------------------
*/

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
