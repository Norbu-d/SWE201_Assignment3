/**
 * hooks/index.ts
 * Custom reusable hooks used across screens.
 */

import { useEffect, useRef, useState } from "react";
import type { BookFormData } from "../utils/types";

// ─── useForm ─────────────────────────────────────────────────────────────────
/**
 * Generic form state hook with validation support.
 * Used by CreateBook and EditBook screens.
 */

type ValidationRules<T> = Partial<{
  [K in keyof T]: (value: T[K]) => string | null;
}>;

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  rules: ValidationRules<T> = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error on edit
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const touch = (field: keyof T) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let valid = true;

    for (const key in rules) {
      const rule = rules[key as keyof T];
      if (rule) {
        const msg = rule(values[key as keyof T]);
        if (msg) {
          newErrors[key as keyof T] = msg;
          valid = false;
        }
      }
    }

    setErrors(newErrors);
    // Mark all fields as touched on submit
    const allTouched = Object.keys(values).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Partial<Record<keyof T, boolean>>
    );
    setTouched(allTouched);
    return valid;
  };

  const reset = (newValues?: T) => {
    setValues(newValues ?? initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, setValue, touch, validate, reset };
}

// ─── useFetchList ─────────────────────────────────────────────────────────────
/**
 * Generic data-fetching hook with loading, error, and retry state.
 */

export function useFetchList<T>(
  fetcher: () => Promise<T[]>,
  deps: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError(e.message ?? "Unknown error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error, retry: load };
}

// ─── useDebounce ─────────────────────────────────────────────────────────────
/**
 * Debounces a value by the given delay.
 * Used for search input so we don't fire an API call on every keystroke.
 */

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ─── Default empty BookFormData ───────────────────────────────────────────────

export const emptyBookForm: BookFormData = {
  title: "",
  author: "",
  genre_id: "",
  status: "want_to_read",
  rating: "",
  notes: "",
  cover_url: "",
  total_pages: "",
};

// ─── Book form validation rules ───────────────────────────────────────────────

export const bookFormRules: ValidationRules<BookFormData> = {
  title: (v) =>
    !v.trim()
      ? "Title is required"
      : v.trim().length < 2
      ? "Title must be at least 2 characters"
      : v.trim().length > 200
      ? "Title must be under 200 characters"
      : null,
  author: (v) =>
    !v.trim()
      ? "Author is required"
      : v.trim().length < 2
      ? "Author must be at least 2 characters"
      : null,
  rating: (v) => {
    if (!v) return null; // optional
    const n = Number(v);
    if (isNaN(n) || n < 1 || n > 5) return "Rating must be between 1 and 5";
    return null;
  },
  total_pages: (v) => {
    if (!v) return null; // optional
    const n = Number(v);
    if (isNaN(n) || n < 1) return "Pages must be a positive number";
    return null;
  },
};
