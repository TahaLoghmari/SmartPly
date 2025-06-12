import type { LoginUserDto, RegisterUserDto, User } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    credentials: "include",
    ...options,
  });

  if (
    response.status === 401 &&
    !endpoint.includes("/auth/refresh") &&
    !endpoint.includes("/auth/login")
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = authApi
        .refresh()
        .then(() => {
          isRefreshing = false;
          refreshPromise = null;
        })
        .catch(() => {
          isRefreshing = false;
          refreshPromise = null;
          window.location.href = "/login";
          throw new Error("Session expired");
        });
    }

    if (refreshPromise) {
      await refreshPromise;
      return request<T>(endpoint, options);
    }
  }

  if (!response.ok) {
    let error = "An error occurred";
    try {
      const data = await response.text();
      error = data || error;
    } catch {}
    throw new Error(error);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return undefined as T;
}

export const authApi = {
  login(credentials: LoginUserDto) {
    return request<string>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register(credentials: RegisterUserDto) {
    return request<string>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout() {
    return request<string>("/auth/logout", {
      method: "POST",
    });
  },

  async getGoogleOAuthUrl() {
    const response = await request<{ authorizationUrl: string }>(
      "/auth/google/authorize",
    );
    window.location.href = response.authorizationUrl;
  },

  refresh() {
    return request<string>("/auth/refresh", {
      method: "POST",
    });
  },

  getCurrentUser() {
    return request<User>("/auth/me");
  },
};

// this file declares the API Calls without state management
