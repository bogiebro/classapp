require! <[ express http path ./cas ]>
Firebase = require('firebase')
graph = require('fbgraph')
FirebaseTokenGenerator = require("firebase-token-generator")
MobileDetect = require('mobile-detect')
firebase = new Firebase(process.env.BASE)

# Express config
express.static.mime.define({'text/cache-manifest': ['appcache']})
app = express!
development = process.env.NODE_ENV in ['testing', 'development']
app.set('port', process.env.PORT || 5000)
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

# Middlewcodese
app.use _
  .. if development then express.logger 'dev' else express.logger!
  .. express.favicon(path.join(__dirname, 'favicon.ico'))
  .. express.compress!
app.use('/js', express.static(path.join(__dirname, 'build/js')))
app.use('/css', express.static(path.join(__dirname, 'build/css')))
app.use('/img', express.static(path.join(__dirname, 'build/img')))
app.use('/fonts', express.static(path.join(__dirname, 'build/fonts')))
app.use express.cookieParser!
app.use app.router
app.use('/splash', express.static(path.join(__dirname, 'build/splash')))
app.use(cas.checkCookie(generateToken))
app.use('/editor', express.static(path.join(__dirname, 'build/editor')))
app.use('/main', mobilizer)
app.use(express.errorHandler!) if development

# Get JSON
app.get '/classcodes.json' (req, res)!->
  firebase.child('classcodes').on 'value' (snapshot)->
    res.send(snapshot.val!)

# Extend a facebook access token
json = express.json!
app.post '/extendToken', json, (req, res)!->
  graph.extendAccessToken({
    access_token: req.body.token,
    client_id: process.env.FBID,
    client_secret: process.env.FBSECRET}, (err, fbres)->
      firebase.child("/users/#{req.body.netid}").update(token: fbres.access_token) if (!err))
  res.send 200

# Get the root
app.get '/' (req, res)!->
  if req.cookies.casInfo? then res.redirect '/main/index.html'
  else res.redirect '/splash/index.html'

# Get an appcache
app.get /^\/(\w+\.appcache)/ (req, res)!->
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
if process.env.NODE_ENV is 'testing'
  app.get '/testlogin' (req, res)!->
      data = JSON.stringify do
          token: tokenGenerator.createToken(netid: 'tester')
          netid: 'tester'
      res.cookie('casInfo', data, {})
      res.send 200

# start the server
http.createServer(app).listen(app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port')))
