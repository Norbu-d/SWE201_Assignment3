import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { colors } from "../../src/components/ui";

function TabIcon({ label, emoji }: { label: string; emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingVertical: 12,
          paddingBottom: 24,
          height: 80,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="books"
        options={{
          title: "Library",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji={focused ? "📚" : "📚"} label="Library" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <TabIcon emoji="👤" label="Profile" />,
        }}
      />
    </Tabs>
  );
}
