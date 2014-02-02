-- Deploy userrooms
-- requires: users
-- requires: rooms

BEGIN;

CREATE TABLE userrooms (
    userid INTEGER NOT NULL,
    roomid INTEGER NOT NULL,
    professor BOOLEAN NOT NULL
);

COMMIT;
