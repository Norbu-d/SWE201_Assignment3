/**
 * components/BookForm.tsx
 * Reusable form used by both CreateBook and EditBook screens.
 * Handles all validation UI and input fields.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { BookStatus, Genre } from "../utils/types";
import { Button, colors, Input } from "./ui";

const STATUSES: { label: string; value: BookStatus }[] = [
  { label: "Want to Read", value: "want_to_read" },
  { label: "Reading", value: "reading" },
  { label: "Read", value: "read" },
];

interface FormValues {
  title: string;
  author: string;
  genre_id: string;
  status: BookStatus;
  rating: string;
  notes: string;
  cover_url: string;
  total_pages: string;
}

interface FormErrors {
  title?: string;
  author?: string;
  rating?: string;
  total_pages?: string;
}

interface Props {
  values: FormValues;
  errors: FormErrors;
  genres: Genre[];
  isSubmitting: boolean;
  submitLabel: string;
  onChangeField: (field: keyof FormValues, value: string) => void;
  onBlurField: (field: keyof FormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function BookForm({
  values,
  errors,
  genres,
  isSubmitting,
  submitLabel,
  onChangeField,
  onBlurField,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
      <Input
        label="Title *"
        value={values.title}
        onChangeText={(v) => onChangeField("title", v)}
        onBlur={() => onBlurField("title")}
        error={errors.title}
        placeholder="Enter book title"
      />

      <Input
        label="Author *"
        value={values.author}
        onChangeText={(v) => onChangeField("author", v)}
        onBlur={() => onBlurField("author")}
        error={errors.author}
        placeholder="Enter author name"
      />

      {/* Status Selector */}
      <Text style={styles.label}>Status</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[
              styles.statusBtn,
              values.status === s.value && styles.statusBtnActive,
            ]}
            onPress={() => onChangeField("status", s.value)}
          >
            <Text
              style={[
                styles.statusBtnText,
                values.status === s.value && styles.statusBtnTextActive,
              ]}
            >
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Genre Selector */}
      <Text style={styles.label}>Genre</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
      >
        <TouchableOpacity
          style={[
            styles.genreBtn,
            !values.genre_id && styles.genreBtnActive,
          ]}
          onPress={() => onChangeField("genre_id", "")}
        >
          <Text style={[styles.genreText, !values.genre_id && styles.genreTextActive]}>
            None
          </Text>
        </TouchableOpacity>
        {genres.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[
              styles.genreBtn,
              values.genre_id === g.id && styles.genreBtnActive,
            ]}
            onPress={() => onChangeField("genre_id", g.id)}
          >
            <Text
              style={[
                styles.genreText,
                values.genre_id === g.id && styles.genreTextActive,
              ]}
            >
              {g.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Input
        label="Rating (1–5)"
        value={values.rating}
        onChangeText={(v) => onChangeField("rating", v)}
        onBlur={() => onBlurField("rating")}
        error={errors.rating}
        placeholder="Optional"
        keyboardType="numeric"
        maxLength={1}
      />

      <Input
        label="Total Pages"
        value={values.total_pages}
        onChangeText={(v) => onChangeField("total_pages", v)}
        onBlur={() => onBlurField("total_pages")}
        error={errors.total_pages}
        placeholder="Optional"
        keyboardType="numeric"
      />

      <Input
        label="Cover Image URL"
        value={values.cover_url}
        onChangeText={(v) => onChangeField("cover_url", v)}
        placeholder="https://..."
        autoCapitalize="none"
        keyboardType="url"
      />

      <Input
        label="Notes"
        value={values.notes}
        onChangeText={(v) => onChangeField("notes", v)}
        placeholder="Your thoughts..."
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <View style={styles.actions}>
        <Button
          title={submitLabel}
          loading={isSubmitting}
          onPress={onSubmit}
          style={styles.submitBtn}
        />
        <Button
          title="Cancel"
          variant="ghost"
          onPress={onCancel}
          style={styles.cancelBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  statusBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  statusBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "15",
  },
  statusBtnText: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  statusBtnTextActive: { color: colors.primary, fontWeight: "700" },
  genreScroll: { marginBottom: 20 },
  genreBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 10,
  },
  genreBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "15",
  },
  genreText: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  genreTextActive: { color: colors.primary, fontWeight: "700" },
  textArea: { height: 110, textAlignVertical: "top" },
  actions: { gap: 14, marginTop: 12, marginBottom: 40 },
  submitBtn: {},
  cancelBtn: {},
});
