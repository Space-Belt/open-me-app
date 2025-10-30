import { ISecureStoreAuthData } from "@/types/auth";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

const KEY = "auth_data";

/********** 시큐어스토어 토큰 저장 훅 **********/
export const useAuth = () => {
  const [auth, setAuth] = useState<ISecureStoreAuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadAuth();
  }, []);

  /********** 시큐어스토어 토큰 불러오기 **********/
  const loadAuth = async () => {
    try {
      const data = await SecureStore.getItemAsync(KEY);
      if (data) {
        const parsed: ISecureStoreAuthData = JSON.parse(data);
        setAuth(parsed);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("auth 불러오기 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  /********** 로그인 시 토큰등 정보 저장 **********/
  const login = useCallback(async (data: ISecureStoreAuthData) => {
    try {
      await SecureStore.setItemAsync(KEY, JSON.stringify(data));
      setAuth(data);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      console.error("로그인 실패:", e);
      return false;
    }
  }, []);

  /********** 로그아웃 시 토큰등의 정보 삭제 **********/
  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(KEY);
      setAuth(null);
      setIsAuthenticated(false);
      return true;
    } catch (e) {
      console.error("로그아웃 실패:", e);
      return false;
    }
  }, []);

  return { auth, isAuthenticated, isLoading, login, logout };
};
