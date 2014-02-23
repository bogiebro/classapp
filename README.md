classapp
========

Study group project for Software Engineering (2014)

The environment variables GENSECRET and FACEBOOK must be set before running (set it in your .env file).
To build run `npm install`. For development, run the script `devel.sh`. This requires foreman (ie the Heroku Toolbelt).
For tests run `test.sh`. A full description of the installation process is on the google doc

The `app` directory contains front-end code. `auth` contains files that only authenticated users can see, which files in `static` are accessible to everyone.
`resources` contains scripts from third parties. All javascript in these directories is concatenated and minified to either `build/js/main.js` during builds. All css is sent to `build/css/main.css`. Files named `index.jade` will retain their original directory structure inside the build directory. Other jade files will be compiled as javascript templates in `build/js`. Anything in `assets` is copied directly to the build directory. This process is specified in `config.ls`.

The `$ref` service in the `app.auth` module should be the only means of interaction with Firebase. Its `base` field contains the Firebase object, its `netid` field contains the currently logged-in user's netid, and the `me` object contains auto-synced information about the user (full name, picture, facebook info, etc).

See the wiki for more details.
