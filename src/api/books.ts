/**
 * api/books.ts
 * Centralised API module for the Book entity.
 * All Supabase calls go through here — screens/stores never import supabase directly.
 */

import { supabase } from "../config/supabase";
import type { Book, BookFormData, BooksFilter } from "../utils/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toNumber = (v: string | undefined) => {
  const n = Number(v);
  return isNaN(n) || v === "" ? null : n;
};

const buildPayload = (data: BookFormData, userId: string) => ({
  title: data.title.trim(),
  author: data.author.trim(),
  genre_id: data.genre_id || null,
  status: data.status,
  rating: toNumber(data.rating),
  notes: data.notes.trim() || null,
  cover_url: data.cover_url.trim() || null,
  total_pages: toNumber(data.total_pages),
  user_id: userId,
  updated_at: new Date().toISOString(),
});

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function fetchBooks(filter: BooksFilter): Promise<Book[]> {
  let query = supabase
    .from("books")
    .select("*, genre:genres(id, name, created_at)")
    .order("created_at", { ascending: false });

  if (filter.status !== "all") {
    query = query.eq("status", filter.status);
  }
  if (filter.genre_id) {
    query = query.eq("genre_id", filter.genre_id);
  }
  if (filter.search.trim()) {
    query = query.or(
      `title.ilike.%${filter.search}%,author.ilike.%${filter.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as Book[]) ?? [];
}

export async function fetchBookById(id: string): Promise<Book> {
  const { data, error } = await supabase
    .from("books")
    .select("*, genre:genres(id, name, created_at)")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Book;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createBook(
  data: BookFormData,
  userId: string
): Promise<Book> {
  const payload = buildPayload(data, userId);

  const { data: created, error } = await supabase
    .from("books")
    .insert([payload])
    .select("*, genre:genres(id, name, created_at)")
    .single();

  if (error) throw new Error(error.message);
  return created as Book;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateBook(
  id: string,
  data: BookFormData,
  userId: string
): Promise<Book> {
  const payload = buildPayload(data, userId);

  const { data: updated, error } = await supabase
    .from("books")
    .update(payload)
    .eq("id", id)
    .select("*, genre:genres(id, name, created_at)")
    .single();

  if (error) throw new Error(error.message);
  return updated as Book;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
