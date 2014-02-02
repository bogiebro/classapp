-- Deploy users

BEGIN;

CREATE TABLE users (
    netid VARCHAR(8) NOT NULL,
    id SERIAL PRIMARY KEY,
    pic VARCHAR(256),
    name TEXT NOT NULL
);

COMMIT;
