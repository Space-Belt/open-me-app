import { typography } from "@/constants/theme";
import { useModalStore } from "@/store/modalStore";
import React from "react";
import { Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import BasicButton from "./BasicButton";
import BasicText from "./BasicText";

const BasicModal = () => {
  const { visible, title, message, buttons, closeModal } = useModalStore();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <Pressable style={styles.overlay} onPress={closeModal}>
        <View style={styles.card}>
          {title && <BasicText style={styles.title}>{title}</BasicText>}
          <BasicText style={styles.message}>{message}</BasicText>
          <View style={styles.buttonRow}>
            {buttons.map((btn, i) => (
              <BasicButton
                key={btn.label}
                title={btn.label}
                variant={btn.variant || (i === 1 ? "primary" : "outline")}
                size="small"
                style={
                  i > 0
                    ? ([styles.button, styles.buttonLeft] as ViewStyle[])
                    : ([styles.button] as ViewStyle[])
                }
                onPress={() => {
                  btn.onPress();
                  closeModal();
                }}
              />
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  title: {
    ...typography.headline18Bold,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    ...typography.body14Regular,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignSelf: "stretch",
  },
  button: {
    flex: 1,
  },
  buttonLeft: {
    marginLeft: 10,
  },
});

export default BasicModal;
