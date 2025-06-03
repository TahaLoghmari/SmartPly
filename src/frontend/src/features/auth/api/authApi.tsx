import type {
  LoginUserDto,
  RegisterUserDto,
  AccessTokensDto,
  User,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    let error = "An error occurred";
    try {
      const data = await response.json();
      error = data.title || data.message || error;
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
    return request<AccessTokensDto>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register(credentials: RegisterUserDto) {
    return request<AccessTokensDto>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  refresh() {
    return request<AccessTokensDto>("/auth/refresh", { method: "POST" });
  },

  logout() {
    return request<void>("/auth/logout", { method: "POST" });
  },

  getCurrentUser() {
    return request<User>("/auth/me");
  },
};

// this file declares the API Calls without state management 