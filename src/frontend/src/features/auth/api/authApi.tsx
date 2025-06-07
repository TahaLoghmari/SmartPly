import type { LoginUserDto, RegisterUserDto, User } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:5001";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
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
    return request<{ message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register(credentials: RegisterUserDto) {
    return request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async googleLogin() {
    const response = await request<{ authorizationUrl: string }>(
      "/auth/google/authorize",
    );
    window.open(
      response.authorizationUrl,
      "google-oauth-popup",
      "width=500,height=600,top=100,left=100,noopener,noreferrer",
    );
    return { message: "Redirecting to Google..." };
  },

  refresh() {
    return request<{ message: string }>("/auth/refresh", { method: "POST" });
  },

  logout() {
    return request<{ message: string }>("/auth/logout", { method: "POST" });
  },

  getCurrentUser() {
    return request<User>("/auth/me");
  },
};

// this file declares the API Calls without state management
