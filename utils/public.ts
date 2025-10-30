import { Dimensions, Platform } from "react-native";

export const isIOS = Platform.OS === "ios";

export const POSTS_PAGE_SIZE = 10;

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");
