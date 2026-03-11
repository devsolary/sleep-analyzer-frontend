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
import { loginUser, clearError } from "../../store/slices/authSlice";
import { Colors, Typography, Spacing, BorderRadius } from "../../theme";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(clearError());
    if (!email || !password) return;
    dispatch(loginUser({ email: email.trim().toLowerCase(), password }));
  };

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
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🌙</Text>
            <Text style={styles.logoText}>SleepLens</Text>
            <Text style={styles.tagline}>Track · Analyze · Improve</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Welcome back</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!email || !password) && styles.submitBtnDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.switchText}>
                Don't have an account?{" "}
                <Text style={{ color: Colors.primary }}>Sign up</Text>
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
  logoWrap: { alignItems: "center", marginBottom: Spacing["3xl"] },
  logoEmoji: { fontSize: 60 },
  logoText: {
    fontSize: Typography.size["4xl"],
    color: Colors.text,
    fontFamily: Typography.fontDisplay,
    marginTop: Spacing.md,
  },
  tagline: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    letterSpacing: 1.5,
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
