require! <[ express http path multiparty ./sockets ]>
MemoryStore = express.session.MemoryStore
sessionStore = new MemoryStore! # should probably use redis instead

# Express config
app = express!
development = 'development' == app.get('env')
app.set('port', process.env.PORT || 3000)
app.use _
  .. if development then express.logger 'dev' else express.logger!
  .. express.compress!
  .. <| express.static <| path.join(__dirname, 'build')
  .. express.urlencoded!
  .. app.router
  .. express.errorHandler! if development

# Yale CAS
cookieParser = express.cookieParser(process.env.SECRET)
session =
  cookieParser
  express.session(store: sessionStore)
  (req, res, next)->
    req.session.rooms = ['main'] # for testing
    req.session.auth =
      loggedIn: true
      user: req.session.cas_user # should find on facebook instead
    next!

cas = require('grand_master_cas')
cas.configure({
  casHost: "secure.its.yale.edu",
  casPath: "/cas",
  ssl: true,
  port: 443,
  service: "#{process.env.SITE}:#{app.get('port')}"
})

json = express.json!

# http responses
app.get '/', session, cas.bouncer, (req, res)!->
  res.send 200

# socketio responses
server = http.createServer(app)
io = require('socket.io').listen(server)
io.set('authorization',
  require('socket.io-express').createAuthFunction(cookieParser, sessionStore))
sockets.startRedis(io)
io.sockets.on('connection', sockets.connect)

# start the server
server.listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
