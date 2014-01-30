require! <[ express http path multiparty ./sockets ]>
io = require('socket.io')

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

session =
  express.cookieParser!
  express.session(secret: process.env.SECRET)

# Yale CAS
cas = require('grand_master_cas')
cas.configure({
  casHost: "secure.its.yale.edu",
  casPath: "/cas",
  ssl: true,
  port: 443,
  service: process.env.SITE + ':' + app.get('port')
})

json = express.json!

# http responses
app.get '/', session, cas.bouncer, (req, res)!-> res.send 200

# socketio responses
server = http.createServer(app)
ioapp = io.listen(server)
sockets.startRedis(ioapp)
ioapp.sockets.on('connection', sockets.connect)

# start the server
server.listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
