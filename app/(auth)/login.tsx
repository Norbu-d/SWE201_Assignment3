/**
 * app/(auth)/login.tsx
 * Login / Sign-up screen.
 */

import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, colors, Input } from "../../src/components/ui";
import { useAuthStore } from "../../src/store/authStore";

export default function LoginScreen() {
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async () => {
    clearError();
    setLocalError("");
    const validationError = validate();
    if (validationError) { setLocalError(validationError); return; }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (mode === "login") {
        await login(trimmedEmail, password);
      } else {
        await register(trimmedEmail, password);
      }
      router.replace("/(tabs)/books");
    } catch {
      // error already set in store
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>📚</Text>
          <Text style={styles.appName}>LibraApp</Text>
          <Text style={styles.tagline}>Your personal library manager</Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === "login" && styles.toggleBtnActive]}
            onPress={() => { setMode("login"); setLocalError(""); clearError(); }}
          >
            <Text style={[styles.toggleText, mode === "login" && styles.toggleTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === "register" && styles.toggleBtnActive]}
            onPress={() => { setMode("register"); setLocalError(""); clearError(); }}
          >
            <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {displayError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button
            title={mode === "login" ? "Sign In" : "Create Account"}
            onPress={handleSubmit}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 48 },
  logo: { fontSize: 72 },
  appName: {
    fontSize: 40,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1,
    marginTop: 12,
  },
  tagline: { color: colors.textSecondary, fontSize: 15, marginTop: 8, fontWeight: "500" },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 6,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  toggleBtnActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8 },
  toggleText: { color: colors.textSecondary, fontWeight: "600", fontSize: 15 },
  toggleTextActive: { color: "#fff", fontWeight: "700" },
  form: {},
  errorBox: {
    backgroundColor: colors.error + "22",
    borderColor: colors.error,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  errorText: { color: colors.error, fontSize: 13, fontWeight: "600" },
});
