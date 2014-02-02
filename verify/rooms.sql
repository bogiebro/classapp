-- Verify rooms

BEGIN;

select id, public, parent, nextmeeting from rooms;

ROLLBACK;
