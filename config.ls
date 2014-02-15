if process.env.NODE_ENV == 'testing'
    process.env.FIREBASE = "https://torid-fire-3655.firebaseio.com/tests/#{process.env.UUID}"
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
                "js/vendor.js": /^bower_components/
                "js/main.js": /^app/
        stylesheets:
            joinTo:
                "css/vendor.css": /^bower_components/
                "css/main.css": /^app/
        templates:
            joinTo: 
              '.compile-jade': /^app/
    plugins:
        jade:
            pretty: no
        uglify:
            mangle: false
