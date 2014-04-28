require! <[ express http path ./cas knox multiparty gm ]>
Firebase = require('firebase')
graph = require('fbgraph')
im = gm.subClass(imageMagick: true)
FirebaseTokenGenerator = require("firebase-token-generator")

# console.log <| JSON.stringify do
#     BASE: process.env.BASE
#     FBID: process.env.FBID
#     S3URL: process.env.S3URL
#     KEY: process.env.s3ID

firebase = new Firebase(process.env.BASE)
firebase.auth(process.env.GENSECRET)

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

# Parse a netid or fail with no permission
netidparse = (req, res, next)!->
  try
    throw new Error 'no cookie' if (!req.cookies.casInfo)
    req.netid = JSON.parse(req.cookies.casInfo).netid
    console.log(req.netid)
    next!
  catch
    res.send 403

# Middleware
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
app.use('/main', express.static(path.join(__dirname, 'build/main')))
app.use(express.errorHandler!) if development

# setup s3
s3 = knox.createClient do
    key: process.env.S3ID
    secret: process.env.S3SECRET
    bucket: 'quipu'

# return from an s3 storage command
s3result = (res, err, r)-->
  console.error err if err
  console.error r.statusCode if r.statusCode != 200
  res.send 200

# upload a picture
app.post '/upload', netidparse, (req, res)!->
  form = new multiparty.Form!
  form.on 'part', (part)!->
    if part.filename is /png|jpg|jpeg|pdf/i
      uploadName = "/pics/#{req.netid}.jpg"
      console.log(uploadName)
      im(part, part.filename).resize(80, 60).setFormat('jpeg').toBuffer (err, buffer)!->
        if err then console.error err else
          s3.putBuffer(buffer, uploadName, {}, s3result res)
          firebase.child("users/#{req.netid}/props/pic").set(process.env.S3URL + uploadName)
  form.parse(req)

# upload something else
app.post '/newfile/:groupid', netidparse, (req, res)!->
  firebase.child("groups/#{req.params.groupid}/users/#{req.netid}").on 'value' (snap)!->
    if snap.val! == req.netid
      form = new multiparty.Form!
      form.on 'part', (part)!->
          header = 'Content-Length': part.byteCount
          s3.putStream part, "/docs/#{req.params.groupid}/#{part.filename}", header, (s3result res)
      form.parse(req)
    else res.send 401

# the usual compatibility creator
ratingRef = (l)-> l.sort!join('')

# update shared classes/ groups
app.post '/joinGroup/:type/:group', netidparse, (req, res)!->
  res.send 200
  # console.log('joining group ' + req.params.group + ' for id ' + req.netid)
  firebase.child("/groups/#{req.params.group}/users").once 'value' (snapshot)!->
    data = snapshot.val!
    for ,val of data
      if val != req.netid
        firebase.child("ratings/#{ratingRef [req.netid, val]}/#{req.params.type}").transaction ((x)->x+1)

# get JSON
classnames = []
app.get '/classnames.json' (req, res)!->
  if classnames.length != 0
    res.send(classnames)
  else
    firebase.child('classnames').once 'value' (snapshot)->
      data = snapshot.val!
      for ,val of data
        classnames.push(val) if val.code
      res.send(classnames)

# extend a facebook access token
json = express.json!
app.post '/extendToken', netidparse, json, (req, res)!->
  graph.extendAccessToken({
    access_token: req.body.token,
    client_id: process.env.FBID,
    client_secret: process.env.FBSECRET}, (err, fbres)->
      firebase.child("/users/#{req.body.netid}/props").update(token: fbres.access_token) if (!err))
  res.send 200

# get the root
app.get '/' (req, res)!->
  if req.cookies.casInfo? then res.redirect '/main/index.html'
  else res.redirect '/splash/index.html'

# get an appcache
# hey peter­ when you're done:
app.get /^\/(\w+\.appcache)/ (req, res)!->
  res.send 404 # comment this out and uncomment below
  #if development then res.send 404 else
  #  res.sendfile(path.join(__dirname, req.params[0]));

# log out
app.get '/logout' (req, res)!->
  res.clearCookie('casInfo')
  res.redirect 'https://secure.its.yale.edu/cas/logout'

# clear the session
app.get '/refresh' (req, res)!->
  res.clearCookie 'casInfo'
  res.redirect req.query.url

# give tests a login route
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
