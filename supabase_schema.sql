-- =====================================================
-- LibraApp — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- 1. Enable UUID generation
create extension if not exists "uuid-ossp";

-- 2. Genres table (secondary entity)
create table if not exists public.genres (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

-- 3. Books table (primary entity)
create table if not exists public.books (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) >= 2 and char_length(title) <= 200),
  author      text not null check (char_length(author) >= 2),
  genre_id    uuid references public.genres(id) on delete set null,
  status      text not null default 'want_to_read'
                check (status in ('want_to_read', 'reading', 'read')),
  rating      int check (rating is null or (rating >= 1 and rating <= 5)),
  notes       text,
  cover_url   text,
  total_pages int check (total_pages is null or total_pages > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 4. Index for fast per-user queries
create index if not exists books_user_id_idx on public.books(user_id);
create index if not exists books_status_idx  on public.books(status);

-- 5. Row-Level Security — users can only see/modify their own books
alter table public.books enable row level security;

create policy "Users can view their own books"
  on public.books for select
  using (auth.uid() = user_id);

create policy "Users can insert their own books"
  on public.books for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own books"
  on public.books for update
  using (auth.uid() = user_id);

create policy "Users can delete their own books"
  on public.books for delete
  using (auth.uid() = user_id);

-- 6. Genres are public (any authenticated user can read/insert)
alter table public.genres enable row level security;

create policy "Authenticated users can read genres"
  on public.genres for select
  to authenticated
  using (true);

create policy "Authenticated users can insert genres"
  on public.genres for insert
  to authenticated
  with check (true);

-- 7. Seed some default genres
insert into public.genres (name) values
  ('Fiction'),
  ('Non-Fiction'),
  ('Science Fiction'),
  ('Fantasy'),
  ('Mystery'),
  ('Thriller'),
  ('Romance'),
  ('Historical Fiction'),
  ('Biography'),
  ('Self-Help'),
  ('Science'),
  ('Technology'),
  ('Philosophy'),
  ('Poetry'),
  ('Graphic Novel')
on conflict (name) do nothing;

-- Done! Your schema is ready.
