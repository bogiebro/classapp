require! <[ express http path multiparty ./sockets ]>
cas = require('grand_master_cas')

# postgres configuration
db = require 'any-db'
pool = db.createPool(process.env.DATABASE_URL, {min: 2, max: 20})

# redis configuration
if process.env.REDISTOGO_URL
    rtg   = url.parse(process.env.REDISTOGO_URL)
    redisClient = ->
        redis.createClient(rtg.port, rtg.hostname)
            ..auth(rtg.auth.split(":")[1])
else redisClient = -> redis.createClient!
RedisStore = require('connect-redis')(express)
redisStore = new RedisStore(client: redisClient!)

# Express config
app = express!
development = 'development' == app.get('env')
app.set('port', process.env.PORT || 3000)

# Yale CAS
cookieParser = express.cookieParser(process.env.SECRET)
getUser = (req, res, next)->
  req.session.rooms = ['main'] # for testing
  req.session.auth =
    loggedIn: true
    user: req.session.cas_user # should find on facebook instead
  next!
cas.configure({
  casHost: "secure.its.yale.edu",
  casPath: "/cas",
  ssl: true,
  port: 443,
  service: "#{process.env.SITE}:#{app.get('port')}/auth/"
})

# Global middleware
app.use _
  .. if development then express.logger 'dev' else express.logger!
  .. express.compress!
app.use('/open', express.static(path.join(__dirname, 'build/open')))
app.use _
  .. express.urlencoded!
  .. app.router
  .. cookieParser
  .. express.session(store: redisStore)
  .. cas.bouncer
  .. getUser
app.use('/auth', express.static(path.join(__dirname, 'build/auth')))
app.use(express.errorHandler! if development)

json = express.json!

# http services IMPLEMENT THESE GUYS
app.get '/', (req, res)!-> res.send 200
app.get '/nextMeeting' (req, res)!-> res.json({})
app.get '/oldChats' (req, res)!-> res.json({})
app.get '/publicRooms' (req, res)!-> res.json({})
app.get '/myRooms' (req, res)!-> res.json({})

# socketio responses
server = http.createServer(app)
io = require('socket.io').listen(server)
io.set('authorization',
  require('socket.io-express').createAuthFunction(cookieParser, sessionStore))
sockets.startDB(io, pool, redisClient)
io.sockets.on('connection', sockets.connect)

# start the server
server.listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
