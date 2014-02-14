trap 'kill -HUP 0' EXIT
set -e
export NODE_ENV=testing
./node_modules/.bin/brunch build
karma start --single-run
foreman start &
FOREMAN=$!
webdriver-manager start &
DRIVER=$!
sleep 20
node_modules/.bin/protractor protractor.conf.js
kill $FOREMAN
kill $DRIVER