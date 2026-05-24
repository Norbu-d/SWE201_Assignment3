/**
 * app/books/create.tsx
 * Create a new book record.
 */

import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookForm } from "../../src/components/BookForm";
import { colors, ErrorBanner } from "../../src/components/ui";
import { bookFormRules, emptyBookForm, useForm } from "../../src/hooks";
import { useAuthStore } from "../../src/store/authStore";
import { useBooksStore } from "../../src/store/booksStore";
import type { BookFormData } from "../../src/utils/types";

export default function CreateBookScreen() {
  const { user } = useAuthStore();
  const { genres, addBook, isSubmitting, error, clearError } = useBooksStore();

  const { values, errors, setValue, touch, validate, reset } =
    useForm<BookFormData>(emptyBookForm, bookFormRules);

  const handleSubmit = async () => {
    if (!validate()) return;
    clearError();
    try {
      await addBook(values, user!.id);
      reset();
      router.back();
    } catch {
      // error shown via store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nav */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Add Book</Text>
        <View style={{ width: 60 }} />
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      <BookForm
        values={values}
        errors={errors}
        genres={genres}
        isSubmitting={isSubmitting}
        submitLabel="Add to Library"
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
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backBtn: { color: colors.primary, fontSize: 16, fontWeight: "600", width: 60 },
  heading: { fontSize: 18, fontWeight: "800", color: colors.text },
});
