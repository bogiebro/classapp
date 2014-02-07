classapp
========

Study group project for Software Engineering (2014)

Environment variables SESSIONSECRET (key for encrypting session data), SITE (hostname of the web app), and GENSECRET must be set before running. 

To build run `npm install`. For development, run `brunch watch` to continuously compile static assets. 

To run the server, use foreman: `foreman start`.

For unit tests run `karma start`. For end to end tests run `webdriver-manager start` to start the testing server and `protractor protractor.conf.js` to run the tests. 