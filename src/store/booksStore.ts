/**
 * store/booksStore.ts
 * Global books state using Zustand.
 * Filter preferences are persisted via AsyncStorage so they survive app restarts.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createBook,
  deleteBook,
  fetchBookById,
  fetchBooks,
  updateBook,
} from "../api/books";
import { fetchGenres } from "../api/genres";
import type { Book, BookFormData, BooksFilter, Genre } from "../utils/types";

interface BooksState {
  // Data
  books: Book[];
  selectedBook: Book | null;
  genres: Genre[];

  // UI state
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Filters (persisted)
  filter: BooksFilter;

  // Actions
  loadBooks: () => Promise<void>;
  loadBookById: (id: string) => Promise<void>;
  loadGenres: () => Promise<void>;
  addBook: (data: BookFormData, userId: string) => Promise<Book>;
  editBook: (id: string, data: BookFormData, userId: string) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
  setFilter: (partial: Partial<BooksFilter>) => void;
  clearSelectedBook: () => void;
  clearError: () => void;
  retryLoad: () => Promise<void>;
}

export const useBooksStore = create<BooksState>()(
  persist(
    (set, get) => ({
      books: [],
      selectedBook: null,
      genres: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      filter: {
        status: "all",
        genre_id: null,
        search: "",
      },

      loadBooks: async () => {
        set({ isLoading: true, error: null });
        try {
          const books = await fetchBooks(get().filter);
          set({ books });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      loadBookById: async (id) => {
        set({ isLoading: true, error: null, selectedBook: null });
        try {
          const book = await fetchBookById(id);
          set({ selectedBook: book });
        } catch (e: any) {
          set({ error: e.message });
        } finally {
          set({ isLoading: false });
        }
      },

      loadGenres: async () => {
        try {
          const genres = await fetchGenres();
          set({ genres });
        } catch {
          // genres are non-critical — silently ignore
        }
      },

      addBook: async (data, userId) => {
        set({ isSubmitting: true, error: null });
        try {
          const book = await createBook(data, userId);
          // Optimistically prepend to list
          set((state) => ({ books: [book, ...state.books] }));
          return book;
        } catch (e: any) {
          set({ error: e.message });
          throw e;
        } finally {
          set({ isSubmitting: false });
        }
      },

      editBook: async (id, data, userId) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await updateBook(id, data, userId);
          set((state) => ({
            books: state.books.map((b) => (b.id === id ? updated : b)),
            selectedBook: updated,
          }));
        } catch (e: any) {
          set({ error: e.message });
          throw e;
        } finally {
          set({ isSubmitting: false });
        }
      },

      removeBook: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await deleteBook(id);
          set((state) => ({
            books: state.books.filter((b) => b.id !== id),
            selectedBook: null,
          }));
        } catch (e: any) {
          set({ error: e.message });
          throw e;
        } finally {
          set({ isSubmitting: false });
        }
      },

      setFilter: (partial) => {
        set((state) => ({ filter: { ...state.filter, ...partial } }));
      },

      clearSelectedBook: () => set({ selectedBook: null }),

      clearError: () => set({ error: null }),

      retryLoad: async () => {
        await get().loadBooks();
      },
    }),
    {
      name: "libra-books-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the filter preferences — not the full book list
      partialize: (state) => ({ filter: state.filter }),
    }
  )
);
