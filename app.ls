require! <[ express http path ./cas ]>
FirebaseTokenGenerator = require("firebase-token-generator")

# Express config
app = express!
development = app.get('env') in ['testing', 'development']
app.set('port', process.env.PORT || 3000)
tokenGenerator = new FirebaseTokenGenerator(process.env.GENSECRET)

# Generate a Firebase token
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
app.use(express.errorHandler!) if development

# Get the root
app.get '/' (req, res)!-> res.redirect '/static/index.html'

# log out
app.get '/logout' (req, res)!-> 
  res.clearCookie('casInfo')
  res.redirect 'https://secure.its.yale.edu/cas/logout'

# Give tests a login route
if app.get('env') is 'testing'
    app.get '/testlogin' (req, res)!-> 
        data = JSON.stringify do
            token: tokenGenerator.createToken(netid: 'tester')
            netid: 'tester'
        res.cookie('casInfo', data, {})
        res.send 200

# start the server
http.createServer(app).listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
