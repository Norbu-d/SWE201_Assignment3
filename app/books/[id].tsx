/**
 * app/books/[id].tsx
 * Book detail screen. Loads by ID, allows edit and delete.
 */

import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  colors,
  ErrorBanner,
  StarRating,
  StatusBadge,
} from "../../src/components/ui";
import { useBooksStore } from "../../src/store/booksStore";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    selectedBook: book,
    isLoading,
    isSubmitting,
    error,
    loadBookById,
    removeBook,
    clearSelectedBook,
  } = useBooksStore();

  useEffect(() => {
    if (id) loadBookById(id);
    return () => clearSelectedBook();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to remove "${book?.title}" from your library?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeBook(id!);
              router.back();
            } catch {
              // error shown via store
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (error || !book) {
    return (
      <SafeAreaView style={styles.centered}>
        <ErrorBanner message={error ?? "Book not found."} onRetry={() => id && loadBookById(id)} />
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Nav */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/books/edit/${book.id}`)}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.coverSection}>
          {book.cover_url ? (
            <Image source={{ uri: book.cover_url }} style={styles.cover} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverEmoji}>📖</Text>
            </View>
          )}
        </View>

        {/* Core info */}
        <View style={styles.body}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>

          <View style={styles.badges}>
            <StatusBadge status={book.status} />
            {book.genre && (
              <View style={styles.genreBadge}>
                <Text style={styles.genreText}>{book.genre.name}</Text>
              </View>
            )}
          </View>

          <StarRating rating={book.rating} />

          {/* Details grid */}
          <View style={styles.grid}>
            {book.total_pages && (
              <DetailItem label="Pages" value={String(book.total_pages)} />
            )}
            <DetailItem
              label="Added"
              value={new Date(book.created_at).toLocaleDateString()}
            />
            <DetailItem
              label="Updated"
              value={new Date(book.updated_at).toLocaleDateString()}
            />
          </View>

          {/* Notes */}
          {book.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{book.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Delete */}
        <View style={styles.deleteSection}>
          <Button
            title="Delete Book"
            variant="danger"
            onPress={handleDelete}
            loading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, backgroundColor: colors.bg, justifyContent: "center" },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backBtn: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  editBtn: {
    backgroundColor: colors.primary + "22",
    borderColor: colors.primary,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  editBtnText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
  coverSection: { alignItems: "center", paddingVertical: 24 },
  cover: { width: 160, height: 220, borderRadius: 12 },
  coverPlaceholder: {
    width: 160,
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  coverEmoji: { fontSize: 64 },
  body: { paddingHorizontal: 24 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 32,
    marginBottom: 4,
  },
  author: { color: colors.textSecondary, fontSize: 16, marginBottom: 16 },
  badges: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  genreBadge: {
    backgroundColor: colors.primary + "22",
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  genreText: { color: colors.primary, fontSize: 12, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 16,
  },
  detailItem: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },
  detailValue: { color: colors.text, fontSize: 15, fontWeight: "600", marginTop: 4 },
  notesBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  notesLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 },
  notesText: { color: colors.textSecondary, fontSize: 14, lineHeight: 22 },
  deleteSection: { padding: 24, paddingTop: 32 },
  backLink: { padding: 16, alignSelf: "center" },
  backLinkText: { color: colors.primary, fontSize: 15 },
});
