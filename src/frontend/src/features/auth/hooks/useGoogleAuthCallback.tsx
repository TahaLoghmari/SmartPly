import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

export function useGoogleAuthCallback() {
  const { googleLogin, isLoading, error } = useAuth();
  const { setTokens } = useLocalStorage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken });
      navigate("/", { replace: true });
      googleLogin();
    }
  }, [location.search]);

  return {
    isLoading,
    error,
  };
}
