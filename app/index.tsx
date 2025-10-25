import BasicText from "@/components/common/BasicText";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <BasicText>로딩 중...</BasicText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
