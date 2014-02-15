trap 'kill -HUP 0' EXIT
set -e
export NODE_ENV=testing
export UUID=$(uuidgen)
./node_modules/.bin/brunch build
karma start --single-run
foreman start &
webdriver-manager start &
sleep 20
node_modules/.bin/protractor protractor.conf.js
curl -X DELETE https://torid-fire-3655.firebaseio.com/tests/$UUID.json