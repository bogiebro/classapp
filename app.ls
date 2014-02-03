require! <[ express http path ]>
FirebaseTokenGenerator = require("firebase-token-generator")

# Express config
app = express!
development = 'development' == app.get('env')
app.set('port', process.env.PORT || 3000)

# Yale CAS
cas = require('grand_master_cas')
cas.configure({
  casHost: "secure.its.yale.edu",
  casPath: "/cas",
  ssl: true,
  port: 443,
  service: "#{process.env.SITE}:#{app.get('port')}/auth/"
})

# Middleware
app.use _
  .. if development then express.logger 'dev' else express.logger!
  .. express.compress!
app.use('/static', express.static(path.join(__dirname, 'build/static')))
app.use _
  .. express.cookieParser!
  .. express.session(secret: process.env.SESSIONSECRET)
  .. cas.bouncer
  .. app.router
app.use('/auth', express.static(path.join(__dirname, 'build/auth')))
app.use(express.errorHandler! if development)

# Get a Firebase Auth token
app.get '/generate' (req, res)!->
  tokenGenerator = new FirebaseTokenGenerator(process.env.GENSECRET)
  token = tokenGenerator.createToken(netid: req.session.cas_user)
  res.json(token: token, netid: req.session.cas_user)

# Get the root
app.get '/' (req, res)!-> res.redirect '/auth/index.html'

# start the server
http.createServer(app).listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
