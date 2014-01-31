require! <[ redis url ]>
{each, flip} = require 'prelude-ls'

var pusher, subscriber, redisClient

# configure for Heroku
if process.env.REDISTOGO_URL
    rtg   = url.parse(process.env.REDISTOGO_URL)
    redisClient = ->
        redis.createClient(rtg.port, rtg.hostname)
            ..auth(rtg.auth.split(":")[1])
else redisClient = -> redis.createClient!

exports.startRedis = (io)->
    subscriber := redisClient!
    pusher := redisClient!
    subscriber.on "message", (channel, message)->
        data = JSON.parse(message)
        io.sockets.in(data.room).emit(channel, data)
    subscriber.subscribe('chat')
    subscriber.subscribe('nextmeeting')

exports.connect = (s) ->
    rooms = s.handshake.session.rooms
    user = s.handshake.session.cas_user
    each s.join rooms
    s.on 'chat' (data)->
        if data.room in rooms
            pusher.publish('chat', JSON.stringify(data with name: user))
    s.on 'nextmeeting' (nextmeeting)->
        str = JSON.stringify(nextmeeting)
        pusher.set("nextmeeting:#{nextmeeting.room}", str)
        pusher.publish('nextmeeting', str)
    flip(each)(rooms, (room)->
        pusher.get ("nextmeeting:#room"), (err, reply)->
            s.emit('nextmeeting', JSON.parse(reply)) if reply)
