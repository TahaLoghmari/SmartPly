const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let isRefreshing = false;

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    credentials: "include",
    ...options,
  });

  if (
    response.status === 401 &&
    !endpoint.includes("/auth/refresh") &&
    !endpoint.includes("/auth/login") &&
    !isRefreshing
  ) {
    try {
      isRefreshing = true;
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        credentials: "include",
        method: "POST",
      });

      if (refreshResponse.ok) {
        isRefreshing = false;
        return request(endpoint, options);
      } else {
        isRefreshing = false;
        throw new Error("Session expired");
      }
    } catch (error) {
      isRefreshing = false;
      throw new Error("Session expired");
    }
  }

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const textError = await response.text();
      const parsedError = JSON.parse(textError);
      const errorTitle = parsedError.title;
      const errorDetail = parsedError.detail;
      errorMessage = `${errorTitle}: ${errorDetail}`;
    } catch {
      errorMessage = `Server error (${response.status})`;
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}
