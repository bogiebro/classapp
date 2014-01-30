require! <[ express http path passport fs multiparty ./sockets ]>
io = require('socket.io')

# Yale CAS
cas = require('grand_master_cas')
cas.configure({
  casHost: "secure.its.yale.edu",
  casPath: "/cas",
  service: "http://localhost:3000",
})

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
  .. express.cookieParser!

json = express.json!

# http responses
app.get '/', cas.bouncer, (req, res)!-> res.send 200

# socketio responses
server = http.createServer(app)
ioapp = io.listen(server)
sockets.startRedis(ioapp)
ioapp.sockets.on('connection', sockets.connect)

# start the server
server.listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
