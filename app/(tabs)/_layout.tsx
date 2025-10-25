import { primaryColors } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColors.sixty,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color: focused ? primaryColors.sixty : "#888" }}>
              홈
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="my-post"
        options={{
          title: "MyPost",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color: focused ? primaryColors.sixty : "#888" }}>
              내 게시물
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="my-page"
        options={{
          title: "MyPage",
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color: focused ? primaryColors.sixty : "#888" }}>
              마이페이지
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
