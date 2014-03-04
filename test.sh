trap 'curl -X DELETE https://torid-fire-3655.firebaseio.com/tests/$UUID.json; kill -HUP 0' EXIT
set -e
export NODE_ENV=testing
export UUID=$(uuidgen)
echo "####### Building #######
"
./node_modules/.bin/brunch build
echo "
####### Running Unit Tests #######
"
./node_modules/.bin/karma start --single-run
if [ $1 ]
then
    echo "
    ####### Starting the server #######
    "
    ./node_modules/.bin/nf start &
    ./node_modules/.bin/webdriver-manager start &
    sleep 20
    echo "
    ####### Starting end to end tests #######
    "
    ./node_modules/.bin/protractor protractor.conf.js
fi
