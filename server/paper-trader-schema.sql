CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  username VARCHAR(37),
  balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(5) NOT NULL,
  quantity NUMERIC,
  price NUMERIC CHECK (price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR NOT NULL
    REFERENCES users ON DELETE CASCADE
);

-- todo: view setup, will need to come back to it
-- CREATE VIEW stocks_owned AS
--   SELECT ticker, SUM(quantity) AS total_shares, AVG(price) AS avg_cost, (total_shares * avg_cost) AS total_cost
--   FROM transactions
--   GROUP BY ticker
-- );
