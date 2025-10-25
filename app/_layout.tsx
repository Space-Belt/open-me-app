import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.ttf"),
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.ttf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="post" />
      <Stack.Screen name="user" />
    </Stack>
  );
}
