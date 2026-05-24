// ─── Domain Types ─────────────────────────────────────────────────────────────

export type BookStatus = "want_to_read" | "reading" | "read";

export interface Genre {
  id: string;
  name: string;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre_id: string | null;
  genre?: Genre;
  status: BookStatus;
  rating: number | null;        // 1–5
  notes: string | null;
  cover_url: string | null;
  total_pages: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// ─── Form / Input Types ───────────────────────────────────────────────────────

export interface BookFormData {
  title: string;
  author: string;
  genre_id: string;
  status: BookStatus;
  rating: string;       // string for TextInput, converted before API call
  notes: string;
  cover_url: string;
  total_pages: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ─── API / Store Types ────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
}

export type FilterStatus = "all" | BookStatus;

export interface BooksFilter {
  status: FilterStatus;
  genre_id: string | null;
  search: string;
}
