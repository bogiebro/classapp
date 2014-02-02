-- Verify userrooms

BEGIN;

select userid, roomid, professor from userrooms;

ROLLBACK;
