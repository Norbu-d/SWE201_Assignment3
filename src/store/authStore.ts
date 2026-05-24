/**
 * store/authStore.ts
 * Global auth state using Zustand with AsyncStorage persistence.
 * Stores session token so the user stays logged in between app launches.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getSession, signIn, signOut, signUp } from "../api/auth";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,

      // Rehydrate session on app start
      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const session = await getSession();
          set({ session, user: session?.user ?? null });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { session, user } = await signIn(email, password);
          set({ session, user });
        } catch (e: any) {
          set({ error: e.message });
          throw e; // let the screen know it failed
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { session, user } = await signUp(email, password);
          set({ session, user });
        } catch (e: any) {
          set({ error: e.message });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await signOut();
          set({ session: null, user: null });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "libra-auth-storage", // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist session and user — not transient UI state
      partialize: (state) => ({ session: state.session, user: state.user }),
    }
  )
);
