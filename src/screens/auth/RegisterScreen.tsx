import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../store";
import { registerUser, clearError } from "../../store/slices/authSlice";
import { Colors, Typography, Spacing, BorderRadius } from "../../theme";

export default function RegisterScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = () => {
    dispatch(clearError());
    if (password !== confirm) return;
    dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    );
  };

  const valid = name && email && password.length >= 8 && password === confirm;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={[Colors.background, "#0a0a1a"]}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🌙</Text>
            <Text style={styles.logoText}>SleepLens</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Create account</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {[
              {
                label: "Full Name",
                value: name,
                onChange: setName,
                placeholder: "Jane Doe",
                secure: false,
                type: "default" as const,
              },
              {
                label: "Email",
                value: email,
                onChange: setEmail,
                placeholder: "jane@example.com",
                secure: false,
                type: "email-address" as const,
              },
              {
                label: "Password",
                value: password,
                onChange: setPassword,
                placeholder: "8+ characters",
                secure: true,
                type: "default" as const,
              },
              {
                label: "Confirm Pass",
                value: confirm,
                onChange: setConfirm,
                placeholder: "Repeat password",
                secure: true,
                type: "default" as const,
              },
            ].map(({ label, value, onChange, placeholder, secure, type }) => (
              <View style={styles.field} key={label}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={[
                    styles.input,
                    label === "Confirm Pass" &&
                    password !== confirm &&
                    confirm.length > 0
                      ? { borderColor: Colors.error }
                      : {},
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={secure}
                  keyboardType={type}
                  autoCapitalize={label === "Full Name" ? "words" : "none"}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.submitBtn, !valid && styles.submitBtnDisabled]}
              onPress={handleRegister}
              disabled={isLoading || !valid}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.switchText}>
                Already have an account?{" "}
                <Text style={{ color: Colors.primary }}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flexGrow: 1, justifyContent: "center", padding: Spacing.xl },
  logoWrap: { alignItems: "center", marginBottom: Spacing["2xl"] },
  logoEmoji: { fontSize: 50 },
  logoText: {
    fontSize: Typography.size["3xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
    marginTop: Spacing.sm,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: Typography.size["2xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
    marginBottom: Spacing.xl,
  },
  errorBanner: {
    backgroundColor: Colors.error + "22",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.error + "55",
  },
  errorText: { color: Colors.error, fontSize: Typography.size.sm },
  field: { marginBottom: Spacing.lg },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.size.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: {
    color: Colors.white,
    fontSize: Typography.size.lg,
    fontFamily: Typography.fontSemiBold,
  },
  switchBtn: { alignItems: "center", marginTop: Spacing.xl },
  switchText: { color: Colors.textSecondary, fontSize: Typography.size.sm },
});
