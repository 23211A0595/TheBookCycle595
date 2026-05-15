create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  college text,
  phone text,
  location text,
  rating numeric(2, 1) not null default 5.0,
  created_at timestamptz not null default now()
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references users(id) on delete set null,
  title text not null,
  author text not null,
  price integer not null check (price > 0),
  condition text not null check (condition in ('New', 'Like New', 'Used')),
  image text not null,
  category text not null,
  description text not null,
  location text not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  created_at timestamptz not null default now()
);

create table if not exists wishlist (
  user_id uuid not null references users(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references users(id) on delete cascade,
  book_id uuid not null references books(id) on delete restrict,
  seller_id uuid references users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete set null,
  buyer_id uuid not null references users(id) on delete cascade,
  seller_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (book_id, buyer_id, seller_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists books_search_idx on books using gin (
  to_tsvector('english', title || ' ' || author || ' ' || category || ' ' || location)
);

