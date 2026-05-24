/**
 * app/(tabs)/books.tsx
 * Main library screen — list view with search, filter, and navigation to detail/create.
 */

import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookCard } from "../../src/components/BookCard";
import { colors, EmptyState, ErrorBanner } from "../../src/components/ui";
import { useDebounce } from "../../src/hooks";
import { useBooksStore } from "../../src/store/booksStore";
import type { FilterStatus } from "../../src/utils/types";

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Want", value: "want_to_read" },
  { label: "Reading", value: "reading" },
  { label: "Read", value: "read" },
];

export default function BooksScreen() {
  const {
    books,
    isLoading,
    error,
    filter,
    setFilter,
    loadBooks,
    loadGenres,
    retryLoad,
  } = useBooksStore();

  const debouncedSearch = useDebounce(filter.search, 400);

  // Load genres once
  useEffect(() => { loadGenres(); }, []);

  // Reload whenever filter changes (debounced search)
  useEffect(() => { loadBooks(); }, [filter.status, filter.genre_id, debouncedSearch]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>LibraApp</Text>
          <Text style={styles.subtitle}>{books.length} book{books.length !== 1 ? "s" : ""}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/books/create")}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={filter.search}
          onChangeText={(v) => setFilter({ search: v })}
          placeholder="Search by title or author..."
          placeholderTextColor={colors.textMuted}
        />
        {filter.search ? (
          <TouchableOpacity onPress={() => setFilter({ search: "" })}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Status Filter */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterBtn, filter.status === f.value && styles.filterBtnActive]}
            onPress={() => setFilter({ status: f.value })}
          >
            <Text
              style={[
                styles.filterText,
                filter.status === f.value && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error */}
      {error ? <ErrorBanner message={error} onRetry={retryLoad} /> : null}

      {/* List */}
      {isLoading && books.length === 0 ? (
        <ActivityIndicator
          color={colors.primary}
          size="large"
          style={{ marginTop: 60 }}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookCard book={item} />}
          contentContainerStyle={books.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            <EmptyState
              message={
                filter.search || filter.status !== "all"
                  ? "No books match your filters."
                  : "Your library is empty.\nTap '+ Add' to add your first book!"
              }
            />
          }
          refreshing={isLoading}
          onRefresh={loadBooks}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: { color: colors.textSecondary, fontSize: 13, fontWeight: "500" },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 12,
  },
  clearSearch: { color: colors.textMuted, fontSize: 16, padding: 4 },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "22",
  },
  filterText: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: colors.primary },
  listContent: { paddingBottom: 100 },
  emptyContainer: { flex: 1, paddingBottom: 80 },
});
