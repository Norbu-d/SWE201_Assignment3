/**
 * app/(tabs)/profile.tsx
 * User profile & settings screen.
 */

import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, colors } from "../../src/components/ui";
import { useAuthStore } from "../../src/store/authStore";
import { useBooksStore } from "../../src/store/booksStore";

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuthStore();
  const { books } = useBooksStore();

  const readCount = books.filter((b) => b.status === "read").length;
  const readingCount = books.filter((b) => b.status === "reading").length;
  const wantCount = books.filter((b) => b.status === "want_to_read").length;

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      {/* User info */}
      <Card style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email ?? "Unknown"}</Text>
        <Text style={styles.userId}>ID: {user?.id?.slice(0, 8)}...</Text>
      </Card>

      {/* Stats */}
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.statsRow}>
        <StatBox label="Read" count={readCount} color={colors.statusRead} />
        <StatBox label="Reading" count={readingCount} color={colors.statusReading} />
        <StatBox label="Want" count={wantCount} color={colors.statusWant} />
      </View>

      <View style={styles.spacer} />

      <Button
        title="Sign Out"
        variant="danger"
        onPress={handleLogout}
        loading={isLoading}
      />
    </SafeAreaView>
  );
}

function StatBox({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <View style={[styles.statBox, { borderColor: color }]}>
      <Text style={[styles.statCount, { color }]}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16, paddingBottom: 100 },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 20,
    letterSpacing: 1,
  },
  userCard: { alignItems: "center", paddingVertical: 24, marginBottom: 24 },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#fff" },
  email: { color: colors.text, fontSize: 16, fontWeight: "600" },
  userId: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 32 },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    paddingVertical: 16,
  },
  statCount: { fontSize: 28, fontWeight: "800" },
  statLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "600", marginTop: 4 },
  spacer: { flex: 1 },
});
