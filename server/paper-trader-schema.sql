CREATE TABLE users (
  username VARCHAR(36) PRIMARY KEY,
  balance NUMERIC,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  ticker TEXT NOT NULL,
  quantity NUMERIC CHECK (quantity >= 0),
  price NUMERIC CHECK (price >= 0),
  created_at TIMESTAMP,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

-- todo: view setup, will need to come back to it
-- CREATE VIEW stocks_owned AS
--   SELECT ticker, SUM(quantity) AS total_shares, AVG(price) AS avg_cost, (total_shares * avg_cost) AS total_cost
--   FROM transactions
--   GROUP BY ticker
-- );
