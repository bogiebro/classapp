require! <[ express http path ./cas ]>
FirebaseTokenGenerator = require("firebase-token-generator")
MobileDetect = require('mobile-detect')

# Express config
express.static.mime.define({'text/cache-manifest': ['appcache']})
app = express!
development = app.get('env') in ['testing', 'development']
app.set('port', process.env.PORT || 3000)
tokenGenerator = new FirebaseTokenGenerator(process.env.GENSECRET)

# Generate a Firebase token
generateToken = (netid)-> JSON.stringify do
  token: tokenGenerator.createToken(netid: netid)
  netid: netid

# Serve mobile content
mobilizer = (req, res, next)!->
  md = new MobileDetect(req.headers['user-agent'])
  if md.phone!
    express.static(path.join(__dirname, 'build/mobile'))(req,res,next)
  else
    express.static(path.join(__dirname, 'build/main'))(req, res, next)

# Middleware
app.use _
  .. if development then express.logger 'dev' else express.logger!
  .. express.favicon(path.join(__dirname, 'favicon.ico'))
  .. express.compress!
app.use('/js', express.static(path.join(__dirname, 'build/js')))
app.use('/css', express.static(path.join(__dirname, 'build/css')))
app.use('/img', express.static(path.join(__dirname, 'build/img')))
app.use('/editor', express.static(path.join(__dirname, 'build/editor')))
app.use express.cookieParser!
app.use app.router
app.use('/splash', express.static(path.join(__dirname, 'build/splash')))
app.use(cas.checkCookie(generateToken))
app.use('/main', mobilizer)
app.use(express.errorHandler!) if development

# Get the root
app.get '/' (req, res)!->
  if req.cookies.casInfo? then res.redirect '/main/index.html'
  else res.redirect '/splash/index.html'

# Get an appcache
app.get /^(\w+\.appcache)/ (req, res)!->
  if development then res.send 404 else
    res.sendfile(path.join(__dirname, req.params[0]));

# log out
app.get '/logout' (req, res)!-> 
  res.clearCookie('casInfo')
  res.redirect 'https://secure.its.yale.edu/cas/logout'

# clear the session
app.get '/refresh' (req, res)!->
  res.clearCookie 'casInfo'
  res.redirect req.query.url

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
