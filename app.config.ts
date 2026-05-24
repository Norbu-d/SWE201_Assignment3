import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "LibraApp",
  slug: "libra-app",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  ios: { supportsTablet: true },
  android: { package: "com.libraapp" },
  plugins: ["expo-router"],
  scheme: "libra",
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});