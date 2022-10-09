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
  transction_time TIMESTAMP,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

-- CREATE TABLE stocks_owned (
--   PRIMARY KEY (username, ticker)
--   username VARCHAR(25)
--     REFERENCES users ON DELETE CASCADE,
--   ticker TEXT NOT NULL,
--   quantity NUMERIC,
--   avg_cost NUMERIC,
--   total_cost NUMERIC,
--   total_value NUMERIC
-- );

-- CREATE VIEW stocks_owned AS
--   SELECT ticker, SUM(quantity) AS total_shares, AVG(price) AS avg_cost, (total_shares * avg_cost) AS total_cost
--   FROM transactions
--   GROUP BY ticker
-- );
