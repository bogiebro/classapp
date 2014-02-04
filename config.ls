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