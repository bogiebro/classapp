require! <[ express http path ./cas ]>
FirebaseTokenGenerator = require("firebase-token-generator")

# Express config
app = express!
development = 'development' == app.get('env')
app.set('port', process.env.PORT || 3000)
tokenGenerator = new FirebaseTokenGenerator(process.env.GENSECRET)

# Firebase token generation
generateToken = (netid)-> JSON.stringify do
  token: tokenGenerator.createToken(netid: netid)
  netid: netid

# Middleware
app.use _
  .. if development then express.logger 'dev' else express.logger!
  .. express.compress!
  .. app.router
app.use('/js', express.static(path.join(__dirname, 'build/js')))
app.use('/css', express.static(path.join(__dirname, 'build/css')))
app.use('/img', express.static(path.join(__dirname, 'build/img')))
app.use('/static', express.static(path.join(__dirname, 'build/static')))
app.use _
  .. express.cookieParser!
  .. cas.checkCookie(generateToken)
app.use('/auth', express.static(path.join(__dirname, 'build/auth')))
app.use(express.errorHandler! if development)

# Get the root
app.get '/' (req, res)!-> res.redirect '/static/index.html'

# start the server
http.createServer(app).listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
