import { primaryColors, typography } from "@/constants/theme";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import BasicButton from "./BasicButton";
import BasicText from "./BasicText";

import EyeCloseIcon from "@/assets/images/icons/eye_close.svg";
import EyeOpenIcon from "@/assets/images/icons/eye_open.svg";

interface BasicInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  isPassword?: boolean;
  labelStyle?: object;
  buttonTitle?: string;
  onButtonPress?: () => void;
  buttonLoading?: boolean;
  buttonDisabled?: boolean;
  errorMessage?: string;
  successMessage?: string;
  maxLength?: number;
  showCharCount?: boolean;
  containerStyle?: object;
  inputStyle?: object;
  onBlur?: () => void;
  value?: string;
}

const BasicInput = ({
  label,
  required,
  isPassword = false,
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
  onBlur,
  value,
  ...textInputProps
}: BasicInputProps) => {
  const hasButton = !!buttonTitle;
  const hasError = !!errorMessage;
  const hasSuccess = !!successMessage;

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* 레이블 */}
      {label && (
        <BasicText style={[styles.label, labelStyle]}>
          {label}
          <BasicText style={styles.requiredStyle}>{required && "*"}</BasicText>
        </BasicText>
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
          onBlur={onBlur}
          placeholderTextColor="#999"
          maxLength={maxLength}
          value={value}
          secureTextEntry={isPassword && !passwordVisible}
          {...textInputProps}
        />
        {isPassword && (
          <Pressable
            onPress={() => setPasswordVisible((v) => !v)}
            style={styles.eyeButton}
            hitSlop={12}
          >
            {passwordVisible ? (
              <EyeOpenIcon width={20} height={20} />
            ) : (
              <EyeCloseIcon width={20} height={20} />
            )}
          </Pressable>
        )}
        {/* 버튼 (있을 경우) */}
        {hasButton && (
          <BasicButton
            title={buttonTitle}
            onPress={onButtonPress || (() => {})}
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
  requiredStyle: {
    ...typography.body16SemiBold,
    color: primaryColors.sixty,
  },
  label: {
    ...typography.body16SemiBold,
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
    ...typography.body16Regular,
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
    width: 90,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  footer: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 18,
  },
  errorText: {
    ...typography.caption12Regular,
    color: "#FF3B30",
    flex: 1,
  },
  successText: {
    ...typography.caption12Regular,
    color: primaryColors.sixty,
    flex: 1,
  },
  charCount: {
    ...typography.caption12Regular,
    color: "#999",
  },
  eyeButton: {
    position: "absolute",
    right: 8,
    top: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
