/**
 * components/BookCard.tsx
 * Single book card rendered in the list view.
 */

import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Book } from "../utils/types";
import { colors, StarRating, StatusBadge } from "./ui";

interface Props {
  book: Book;
}

export function BookCard({ book }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/books/${book.id}`)}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        {/* Cover thumbnail */}
        {book.cover_url ? (
          <Image source={{ uri: book.cover_url }} style={styles.cover} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverEmoji}>📖</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>

          <View style={styles.meta}>
            <StatusBadge status={book.status} />
            {book.genre && (
              <View style={styles.genreTag}>
                <Text style={styles.genreText}>{book.genre.name}</Text>
              </View>
            )}
          </View>

          <StarRating rating={book.rating} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: "row", gap: 14 },
  cover: {
    width: 72,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
  },
  coverPlaceholder: {
    width: 72,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  coverEmoji: { fontSize: 36 },
  info: { flex: 1, justifyContent: "space-between" },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  author: { color: colors.textSecondary, fontSize: 13, marginTop: 2, fontWeight: "500" },
  meta: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginVertical: 8 },
  genreTag: {
    backgroundColor: colors.primary + "12",
    borderColor: colors.primary + "40",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  genreText: { color: colors.primary, fontSize: 12, fontWeight: "600" },
});
