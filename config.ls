if process.env.NODE_ENV == 'testing'
    process.env.FIREBASE = "https://torid-fire-3655.firebaseio.com/tests/#{process.env.UUID}"
    FirebaseTokenGenerator = require("firebase-token-generator")
    tokenGenerator = new FirebaseTokenGenerator(process.env.GENSECRET)
    process.env.COOKIE = JSON.stringify do
         token: tokenGenerator.createToken(netid: 'tester')
         netid: 'tester'
else process.env.FIREBASE = "https://torid-fire-3655.firebaseio.com/"

exports.config =
    paths:
        public: 'build'
        jadeCompileTrigger: '.compile-jade'
    modules:
      definition: false
      wrapper: false
    files:
        javascripts:
            joinTo:
                "js/vendor.js": /(^bower_components)|(^vendor)/
                "js/main.js": /^app/
                "js/params.js": /^test\/params/
        stylesheets:
            joinTo:
                "css/vendor.css": /(^bower_components)|(^vendor)/
                "css/main.css": /^app/
        templates:
            joinTo:
              '.compile-jade': /^app/
    plugins:
        jade:
            pretty: yes
        uglify:
            mangle: false
