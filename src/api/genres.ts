/**
 * api/genres.ts
 * API module for the Genre entity (secondary entity).
 */

import { supabase } from "../config/supabase";
import type { Genre } from "../utils/types";

export async function fetchGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from("genres")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as Genre[]) ?? [];
}

export async function createGenre(name: string): Promise<Genre> {
  const { data, error } = await supabase
    .from("genres")
    .insert([{ name: name.trim() }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Genre;
}
