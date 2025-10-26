import BasicIndicator from "@/components/common/BasicIndicator";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/signin");
      }
    }
  }, [isLoading, isAuthenticated]);

  return <BasicIndicator />;
}

const styles = StyleSheet.create({});
