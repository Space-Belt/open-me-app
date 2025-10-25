import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "auth_token";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 토큰 불러오기 (초기화)
  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
    } catch (error) {
      console.error("토큰 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 (토큰 저장)
  const login = useCallback(async (newToken: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("로그인 실패:", error);
      return false;
    }
  }, []);

  // 로그아웃 (토큰 삭제)
  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error("로그아웃 실패:", error);
      return false;
    }
  }, []);

  return {
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
