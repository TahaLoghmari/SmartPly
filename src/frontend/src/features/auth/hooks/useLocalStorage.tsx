import type { TokensDto } from "../types";

function getTokens() {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

function setTokens(credentials: TokensDto) {
  localStorage.setItem("accessToken",credentials.accessToken);
  localStorage.setItem("refreshToken",credentials.refreshToken);
}

export function useLocalStorage() {
  return {
    getTokens,
    clearTokens,
    setTokens,
  };
}
