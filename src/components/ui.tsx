/**
 * components/ui.tsx
 * Reusable UI primitives used across all screens.
 */

import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

// ─── Theme ────────────────────────────────────────────────────────────────────

export const colors = {
  primary: "#3b82f6",       // bright blue
  primaryDark: "#1e40af",
  bg: "#ffffff",            // bright white
  surface: "#f8f9fa",       // light gray for cards
  surfaceAlt: "#f0f1f3",
  border: "#e5e7eb",
  text: "#1f2937",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  error: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
  statusRead: "#10b981",
  statusReading: "#3b82f6",
  statusWant: "#8b5cf6",
};

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "danger" | "ghost";
}

export function Button({
  title,
  loading,
  variant = "primary",
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const bg =
    variant === "danger"
      ? colors.error
      : variant === "ghost"
      ? "transparent"
      : colors.primary;

  const textColor =
    variant === "ghost" ? colors.primary : variant === "danger" ? "#fff" : "#fff";

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: bg, borderColor: variant === "ghost" ? colors.primary : "transparent" },
        isDisabled && styles.btnDisabled,
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.inputWrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  read: colors.statusRead,
  reading: colors.statusReading,
  want_to_read: colors.statusWant,
};

const STATUS_LABELS: Record<string, string> = {
  read: "Read",
  reading: "Reading",
  want_to_read: "Want to Read",
};

export function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? colors.textSecondary;
  return (
    <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ─── ErrorBanner ──────────────────────────────────────────────────────────────

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorBannerText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── StarRating ───────────────────────────────────────────────────────────────

export function StarRating({
  rating,
  max = 5,
}: {
  rating: number | null;
  max?: number;
}) {
  if (!rating) return <Text style={{ color: colors.textMuted }}>No rating</Text>;
  return (
    <Text style={{ fontSize: 16 }}>
      {"★".repeat(rating)}
      {"☆".repeat(max - rating)}
    </Text>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },

  inputWrapper: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "500",
  },
  inputError: { borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: 6, fontWeight: "600" },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  badgeText: { fontSize: 12, fontWeight: "700" },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
    fontWeight: "500",
  },

  errorBanner: {
    backgroundColor: colors.error + "15",
    borderColor: colors.error,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorBannerText: { color: colors.error, flex: 1, fontSize: 13, fontWeight: "600" },
  retryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.error,
    borderRadius: 8,
    marginLeft: 12,
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
