CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_name_unique ON categories (LOWER(name));

CREATE TABLE IF NOT EXISTS expenses (
  id           SERIAL PRIMARY KEY,
  amount       NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category_id  INTEGER NOT NULL REFERENCES categories (id),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses (expense_date);

INSERT INTO categories (name) VALUES
  ('Groceries'), ('Utilities'), ('Food'), ('Transportation'), ('Entertainment')
ON CONFLICT DO NOTHING;
