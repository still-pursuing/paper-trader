\echo 'Delete and recreate paper_trader db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE paper_trader;
CREATE DATABASE paper_trader;
\connect paper_trader

\i paper-trader-schema.sql
-- todo: add a seed file to populate database
-- \i paper-trader-seed.sql

\echo 'Delete and recreate paper_trader_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE paper_trader_test;
CREATE DATABASE paper_trader_test;
\connect paper_trader_test

\i paper-trader-schema.sql