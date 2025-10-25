import React from "react";
import { Text, TextProps } from "react-native";

const BasicText = ({ style, children, ...props }: TextProps) => (
  <Text style={[{ fontFamily: "Pretendard-Regular" }, style]} {...props}>
    {children}
  </Text>
);

export default BasicText;
