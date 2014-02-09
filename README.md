classapp
========
Push Test

Study group project for Software Engineering (2014)

Environment variable GENSECRET must be set before running. 

To build run `npm install`. For development, run `brunch watch` to continuously compile static assets. You can also run the script `devel.sh` which does the same thing.

To run the server, use foreman: `foreman start`.


For unit tests run `karma start`. For end to end tests run `webdriver-manager start` to start the testing server and `protractor protractor.conf.js` to run the tests. The script `test.sh` runs both types of tests back to back.

See the wiki for more details.
