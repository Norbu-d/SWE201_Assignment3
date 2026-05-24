/**
 * app/books/edit/[id].tsx
 * Edit an existing book record.
 */

import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookForm } from "../../../src/components/BookForm";
import { colors, ErrorBanner } from "../../../src/components/ui";
import { bookFormRules, emptyBookForm, useForm } from "../../../src/hooks";
import { useAuthStore } from "../../../src/store/authStore";
import { useBooksStore } from "../../../src/store/booksStore";
import type { BookFormData } from "../../../src/utils/types";

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const {
    selectedBook: book,
    genres,
    isLoading,
    isSubmitting,
    error,
    loadBookById,
    editBook,
    clearError,
    clearSelectedBook,
  } = useBooksStore();

  const { values, errors, setValue, touch, validate, reset } =
    useForm<BookFormData>(emptyBookForm, bookFormRules);

  // Load book and populate form
  useEffect(() => {
    if (id) loadBookById(id);
    return () => clearSelectedBook();
  }, [id]);

  // Populate form when book loads
  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        author: book.author,
        genre_id: book.genre_id ?? "",
        status: book.status,
        rating: book.rating != null ? String(book.rating) : "",
        notes: book.notes ?? "",
        cover_url: book.cover_url ?? "",
        total_pages: book.total_pages != null ? String(book.total_pages) : "",
      });
    }
  }, [book?.id]);

  const handleSubmit = async () => {
    if (!validate()) return;
    clearError();
    try {
      await editBook(id!, values, user!.id);
      router.back();
    } catch {
      // error shown via store
    }
  };

  if (isLoading && !book) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
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
        <Text style={styles.heading}>Edit Book</Text>
        <View style={{ width: 60 }} />
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      <BookForm
        values={values}
        errors={errors}
        genres={genres}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        onChangeField={setValue}
        onBlurField={touch}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
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
  backBtn: { color: colors.primary, fontSize: 16, fontWeight: "600", width: 60 },
  heading: { fontSize: 18, fontWeight: "800", color: colors.text },
});
