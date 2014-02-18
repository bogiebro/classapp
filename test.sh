trap 'kill -HUP 0' EXIT
set -e
export NODE_ENV=testing
export UUID=$(uuidgen)
echo "####### Building #######
"
./node_modules/.bin/brunch build
echo "
####### Running Unit Tests #######
"
karma start --single-run
echo "
####### Starting the server #######
"
foreman start &
webdriver-manager start &
sleep 20
echo "
####### Starting end to end tests #######
"
node_modules/.bin/protractor protractor.conf.js
echo "
####### Deleting test directory #######
"
curl -X DELETE https://torid-fire-3655.firebaseio.com/tests/$UUID.json