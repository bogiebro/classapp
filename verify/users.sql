-- Verify users

BEGIN;

select netid, id, pic, name from users;

ROLLBACK;
