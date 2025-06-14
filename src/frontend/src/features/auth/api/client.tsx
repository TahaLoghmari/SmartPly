const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function request<T>(
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
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        credentials: "include",
        method: "POST",
      });

      if (refreshResponse.ok) {
        return request(endpoint, options);
      } else {
        throw new Error("Session expired");
      }
    } catch (error) {
      throw new Error("Session expired");
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
