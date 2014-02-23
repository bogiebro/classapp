classapp
========

Study group project for Software Engineering (2014)

The installation process is on the google doc.

The `app` directory contains front-end code. `auth` contains files that only authenticated users can see, but files in `static` are accessible to everyone.
`resources` contains scripts from third parties. All javascript in these directories is concatenated and minified to `build/js/main.js` during builds. All css is sent to `build/css/main.css`. Files named `index.jade` will retain their original directory structure inside the build directory. Other jade files will be compiled as javascript templates in `build/js`. Anything in `assets` is copied directly to the build directory. This process is specified in `config.ls`.

The `$ref` service in the `app.auth` module should be the only means of interaction with Firebase. Its `base` field contains the Firebase object, its `netid` field contains the currently logged-in user's netid, and the `me` object contains auto-synced information about the user (full name, picture, facebook info, etc).

The `$trackConnected$` service in `app.auth` is a function that takes a list of
netids and returns an object that with netids as keys and boolean values giving which
users are online.

The `$group` service in `app.auth` is a object with methods `setGroup` (taking a group id), `props` (giving an autosynced object with the properties of the group such as the name), and `clearGroup` (which sets the selected group to null). This should be used to track the currently selected group.

