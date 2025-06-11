import type { LoginUserDto, RegisterUserDto, TokensDto, User } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    credentials: "include",
    ...options,
  });

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
    return request<TokensDto>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register(credentials: RegisterUserDto) {
    return request<TokensDto>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout() {
    return request<{ message: string }>("/auth/logout", {
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
    return request<TokensDto>("/auth/refresh", {
      method: "POST",
    });
  },

  getCurrentUser() {
    return request<User>("/auth/me");
  },
};

// this file declares the API Calls without state management
