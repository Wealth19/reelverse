// //
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // Attach access token to every request
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const accessToken = localStorage.getItem("accessToken");

//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // Automatically refresh expired access token
// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest?._retry &&
//       typeof window !== "undefined"
//     ) {
//       originalRequest._retry = true;

//       try {
//         /*
//          * We DO NOT read the refresh token.
//          *
//          * The browser automatically sends the
//          * HttpOnly refreshToken cookie because
//          * withCredentials is enabled.
//          */

//         const { data } = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//           {},
//           {
//             withCredentials: true,
//           },
//         );

//         const newAccessToken = data.data.access.token;

//         localStorage.setItem("accessToken", newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("user");

//         window.location.href = "/login";

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default api;

import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
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
        try {
          accessToken = await refreshAccessToken();
        } catch {
          /*
           * Do not redirect here.
           *
           * The request can continue with the current token.
           * If the backend rejects it with 401, the response
           * interceptor will handle the reactive refresh.
           */
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

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  },
);

export default api;
