import { primaryColors } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";

import HomeIcon from "@/assets/images/icons/home_icon.svg";
import MyPageIcon from "@/assets/images/icons/my_page.svg";
import MyPostIcon from "@/assets/images/icons/my_post.svg";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColors.sixty,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon width={30} height={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-post"
        options={{
          title: "MyPost",
          tabBarIcon: ({ color, focused }) => (
            <MyPostIcon width={30} height={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-page"
        options={{
          title: "MyPage",
          tabBarIcon: ({ color, focused }) => (
            <MyPageIcon width={30} height={30} />
          ),
        }}
      />
    </Tabs>
  );
}
