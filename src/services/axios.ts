import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const resolveApiBaseUrl = (): string => {
  const configured =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  if (typeof window === "undefined") {
    return configured;
  }

  try {
    const url = new URL(configured);
    const currentHost = window.location.hostname;
    const isLocalHost = (h: string) => h === "localhost" || h === "127.0.0.1";

    if (isLocalHost(url.hostname) && isLocalHost(currentHost)) {
      url.hostname = currentHost;
      return url.toString().replace(/\/+$/, "");
    }
  } catch {
    // Fallback to configured string
  }

  return configured;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| REFRESH STATE
|--------------------------------------------------------------------------
|
| Prevent multiple requests from refreshing the token simultaneously.
|
*/

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/*
|--------------------------------------------------------------------------
| ACCESS TOKEN HELPERS
|--------------------------------------------------------------------------
*/

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
};

const saveAccessToken = (token: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("accessToken", token);

  /*
   * Notify AuthContext and any other listeners that the
   * access token has changed.
   */
  window.dispatchEvent(
    new CustomEvent("auth:token-refreshed", {
      detail: {
        accessToken: token,
      },
    }),
  );
};

const clearAuthentication = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("auth:logout"));
};

/*
|--------------------------------------------------------------------------
| JWT EXPIRATION
|--------------------------------------------------------------------------
|
| We only decode the token to read "exp".
|
| This does NOT verify the token.
| The backend is always responsible for verification.
|
*/

const getTokenExpiration = (token: string): number | null => {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));

    if (!payload.exp) {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
};

/*
|--------------------------------------------------------------------------
| REFRESH ACCESS TOKEN
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| We NEVER read the refresh token.
|
| The browser automatically sends the HttpOnly cookie because
| withCredentials is enabled.
|
*/

const refreshAccessToken = async (): Promise<string> => {
  /*
   * If another request is already refreshing the token,
   * wait for that same request.
   */
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = axios
    .post(
      `${resolveApiBaseUrl()}/auth/refresh`,
      {},
      {
        withCredentials: true,
      },
    )
    .then((response) => {
      const newAccessToken = response.data?.data?.access?.token;

      if (!newAccessToken) {
        throw new Error("Refresh endpoint did not return an access token.");
      }

      saveAccessToken(newAccessToken);

      return newAccessToken;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
|
| PROACTIVE REFRESH
|
| Before every request:
|
| 1. Get access token.
| 2. Check expiration.
| 3. If it expires within 5 minutes, refresh it.
| 4. Attach the latest token.
|
*/

api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    if (typeof window === "undefined") {
      return config;
    }

    config.baseURL = resolveApiBaseUrl();

    /*
     * Never intercept the refresh endpoint itself.
     */
    if (config.url?.includes("/auth/refresh")) {
      return config;
    }

    let accessToken = getAccessToken();

    if (accessToken) {
      const expiration = getTokenExpiration(accessToken);

      /*
       * Refresh 5 minutes before expiration.
       */
      const refreshBuffer = 5 * 60 * 1000;

      if (expiration !== null && expiration - Date.now() <= refreshBuffer) {
        const isAlreadyExpired = expiration <= Date.now();
        try {
          accessToken = await refreshAccessToken();
        } catch (refreshErr) {
          if (isAlreadyExpired) {
            clearAuthentication();
            if (!window.location.pathname.startsWith("/login")) {
              window.location.href = "/login";
            }
            return Promise.reject(refreshErr);
          }
        }
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
|
| REACTIVE REFRESH
|
| If the access token has already expired and the backend
| returns 401:
|
| 1. Refresh using the HttpOnly cookie.
| 2. Save the new access token.
| 3. Retry the original request.
|
*/

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    /*
     * Network error / no response.
     */
    if (!error.response) {
      return Promise.reject(error);
    }

    /*
     * Do not attempt to refresh the refresh request itself.
     */
    if (originalRequest?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    /*
     * Only handle 401.
     */
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    /*
     * Prevent an infinite retry loop.
     */
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return api(originalRequest);
    } catch (refreshError) {
      /*
       * Refresh token is expired, invalid, or missing.
       *
       * The authentication session is finished.
       */
      clearAuthentication();

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;
