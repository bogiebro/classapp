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
                "static/js/vendor.js": /^bower_components/
                "static/js/main.js": /^app/
        stylesheets:
            joinTo:
                "static/css/vendor.css": /^bower_components/
                "static/css/main.css": /^app/
        templates:
            joinTo: 
              '.compile-jade': /^app/
    plugins:
        jade:
            pretty: no
        uglify:
            mangle: false