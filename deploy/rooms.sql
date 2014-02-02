-- Deploy rooms

BEGIN;

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    public BOOLEAN NOT NULL,
    parent INTEGER,
    nextmeeting JSON
);


COMMIT;
