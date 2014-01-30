require! <[ redis url ]>

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
        io.sockets.emit(channel, JSON.parse(message))
    subscriber.subscribe('chat')
    subscriber.subscribe('nextmeeting')

exports.connect = (s) ->
    s.on 'join', (name)->
        <- s.set('nickname', name)
        pusher.publish('chat', JSON.stringify({type: 'join', name: name}))
    s.on 'disconnect', (data)->
        (err, name) <- s.get 'nickname'
        console.error err if err
        pusher.publish('chat', JSON.stringify({type: 'leave', name: name}))
    s.on 'chat' (data)->
        (err, name) <- s.get 'nickname'
        console.error err if err 
        pusher.publish('chat', JSON.stringify({type: 'chat', name: name, content: data}))

    pusher.get 'nextmeeting', (err, reply)->
        res =   if reply then JSON.parse reply
                else {}
        s.emit('nextmeeting', res)

exports.sendChat = (data)-> pusher.publish('chat', JSON.stringify(data))

exports.setNextMeeting = (nextmeeting)->
    str = JSON.stringify(nextmeeting)
    pusher.set('nextmeeting', str)
    pusher.publish('nextmeeting', str)
