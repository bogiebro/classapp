require! <[ redis url ]>

var pusher, subscriber, pool

# connect to redis and postgres
exports.startDB = (io, p, redisClient)->
    pool := p
    subscriber := redisClient!
    pusher := redisClient!
    subscriber.on "message", (channel, message)->
        data = JSON.parse(message)
        if channel is 'manage'
            switch message.type
            | 'request' => io.sockets.in(data.room).emit(channel, data)
            | 'acceptreq' => # room (person joins room)
            | 'invite' => # person
            | 'acceptinvite' => # room (person joins room)
            | 'newgroup' => # person
            | 'acceptnewgroup' => # person (room created, both join room)
            | 'merge' => io.sockets.in(data.room).emit(channel, data)
            | 'acceptmerge' => # room (one room removed, members join)
        else io.sockets.in(data.room).emit(channel, data)
    subscriber.subscribe('chat')
    subscriber.subscribe('nextmeeting')
    subscriber.subscribe('manage')

# setup responses when the socket sends us stuff
exports.connect = (s) ->
    rooms = s.handshake.session.rooms
    user = s.handshake.session.cas_user
    each s.join rooms
    s.on 'chat' (data)->
        if data.room in rooms
            pusher.publish('chat', JSON.stringify(data with name: user))
    s.on 'nextmeeting' (nextmeeting)->
        if data.room in rooms
            pusher.publish('nextmeeting', JSON.stringify(nextmeeting))
    s.on 'manage' (req)->
        pusher.publish('manage', JSON.stringify(data with name: user))

# Firebase?
# /rooms/#roomid/chats/#chatid/
# /rooms/#roomid/requests
# /rooms/#roomid/users
# /users/#netid/rooms

# With CAS
# honor the auth / open distinction. use grand_master_cas
# whenever we authenticate, we create a firebase token
# we host a route where users can get their firebase token

# What else is on the server?
# Insertion of scraped yale data
