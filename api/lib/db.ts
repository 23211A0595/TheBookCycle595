import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | undefined;
let schemaReady: Promise<void> | undefined;

const schemaSql = `
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
`;

const seedSql = `
insert into books (title, author, price, condition, image, category, description, location)
select *
from (
  values
    ('Introduction to Algorithms', 'Thomas H. Cormen', 450, 'Like New', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=500&fit=crop', 'Computer Science', 'Classic algorithms textbook, 4th edition. Minimal highlighting, no torn pages. Perfect for CS students.', 'Delhi'),
    ('Engineering Mathematics', 'B.S. Grewal', 280, 'Used', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop', 'Mathematics', 'Well-used but all pages intact. Some notes in margins that may be helpful.', 'Mumbai'),
    ('Organic Chemistry', 'Morrison & Boyd', 350, 'New', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=500&fit=crop', 'Chemistry', 'Brand new, never opened. Received as a gift but already had a copy.', 'Bangalore'),
    ('Principles of Economics', 'N. Gregory Mankiw', 320, 'Like New', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop', 'Economics', '8th edition, used for one semester. No marks or highlights.', 'Pune')
) as demo(title, author, price, condition, image, category, description, location)
where not exists (select 1 from books);
`;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(schemaSql)
      .then(() => getPool().query(seedSql))
      .then(() => undefined);
  }
  return schemaReady;
}

export async function query<T extends pg.QueryResultRow>(text: string, params: unknown[] = []) {
  await ensureSchema();
  return getPool().query<T>(text, params);
}
