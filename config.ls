if process.env.NODE_ENV == 'testing'
    require! <[ dotenv ]>
    dotenv.load!
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
                "js/vendor.js": /^bower_components\/(?!(firepad|codemirror))/
                "js/edit-vendor.js": /^bower_components\/(firepad|codemirror)/
                "js/main.js": /^app\/(?!editor)/
                "js/editor.js": /^app\/(editor|shared)/
                "js/params.js": /^test\/params/
        stylesheets:
            joinTo:
                "css/vendor.css": /^bower_components\/(?!(firepad|codemirror))/
                "css/edit-vendor.css": /^bower_components\/(firepad|codemirror)/
                "css/main.css": /^app\/(?!editor)/
                "css/editor.css": /^app\/editor/
        templates:
            joinTo:
              '.compile-jade': /^app/
    plugins:
        jade:
            pretty: yes
        uglify:
            mangle: false
    overrides:
      production:
        conventions:
          ignored: /angular-mocks/
