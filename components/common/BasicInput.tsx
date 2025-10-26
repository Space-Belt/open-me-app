import { typography } from "@/constants/theme";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import BasicButton from "./BasicButton";
import BasicText from "./BasicText";

interface BasicInputProps extends TextInputProps {
  // 레이블 (제목)
  label?: string;
  labelStyle?: TextStyle;

  // 버튼 (중복확인 등)
  buttonTitle?: string;
  onButtonPress?: () => void;
  buttonLoading?: boolean;
  buttonDisabled?: boolean;

  // 유효성 검사
  errorMessage?: string;
  successMessage?: string;

  // 글자수 제한
  maxLength?: number;
  showCharCount?: boolean;

  // 커스텀 스타일
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;

  // 현재 값 (글자수 표시용)
  value?: string;
}

const BasicInput = ({
  label,
  labelStyle,
  buttonTitle,
  onButtonPress,
  buttonLoading = false,
  buttonDisabled = false,
  errorMessage,
  successMessage,
  maxLength,
  showCharCount = false,
  containerStyle,
  inputStyle,
  value,
  ...textInputProps
}: BasicInputProps) => {
  const hasButton = !!buttonTitle;
  const hasError = !!errorMessage;
  const hasSuccess = !!successMessage;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 레이블 */}
      {label && (
        <BasicText style={[styles.label, labelStyle]}>{label}</BasicText>
      )}

      {/* 입력 필드 + 버튼 */}
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            hasButton && styles.inputWithButton,
            hasError && styles.inputError,
            hasSuccess && styles.inputSuccess,
            inputStyle,
          ]}
          placeholderTextColor="#999"
          maxLength={maxLength}
          value={value}
          {...textInputProps}
        />

        {/* 버튼 (있을 경우) */}
        {hasButton && (
          <BasicButton
            title={buttonTitle}
            onPress={onButtonPress || (() => {})}
            loading={buttonLoading}
            disabled={buttonDisabled}
            size="small"
            style={styles.button}
          />
        )}
      </View>

      {/* 하단 영역 (에러/성공 메시지 또는 글자수) */}
      {(hasError || hasSuccess || showCharCount) && (
        <View style={styles.footer}>
          {/* 에러 메시지 */}
          {hasError && (
            <BasicText style={styles.errorText}>{errorMessage}</BasicText>
          )}

          {/* 성공 메시지 */}
          {hasSuccess && !hasError && (
            <BasicText style={styles.successText}>{successMessage}</BasicText>
          )}

          {/* 글자수 표시 */}
          {showCharCount && maxLength && (
            <BasicText style={styles.charCount}>
              {value?.length || 0} / {maxLength}
            </BasicText>
          )}
        </View>
      )}
    </View>
  );
};

export default BasicInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    ...typography.body14SemiBold,
    color: "#333",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    backgroundColor: "#fff",
  },
  inputWithButton: {
    flex: 1,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  inputSuccess: {
    borderColor: "#34C759",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  footer: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 18,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#FF3B30",
    flex: 1,
  },
  successText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#34C759",
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#999",
  },
});
