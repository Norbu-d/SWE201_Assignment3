/**
 * app/_layout.tsx
 * Root layout — initialises auth and redirects based on session.
 */

import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/components/ui";

export default function RootLayout() {
  const { user, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationAttempted = useRef(false);

  // Rehydrate session on app start
  useEffect(() => {
    initialize();
  }, []);

  // Auth guard: redirect based on session
  useEffect(() => {
    if (isLoading || navigationAttempted.current) return;

    const inAuthGroup = segments[0] === "(auth)";
    
    // Use setTimeout to ensure router is ready
    const timer = setTimeout(() => {
      try {
        navigationAttempted.current = true;
        if (!user && !inAuthGroup) {
          router.replace("/(auth)/login");
        } else if (user && inAuthGroup) {
          router.replace("/(tabs)/books");
        }
      } catch (e) {
        // Retry after a short delay if router isn't ready yet
        console.error("Navigation error:", e);
        navigationAttempted.current = false;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
