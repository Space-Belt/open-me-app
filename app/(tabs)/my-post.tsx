import { StyleSheet, Text, View } from "react-native";

export default function MyPostScreen() {
  return (
    <View style={styles.container}>
      <Text>나의 게시물</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
