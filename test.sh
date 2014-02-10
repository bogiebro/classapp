set -e
karma start --single-run
foreman start &
FOREMAN=$!
webdriver-manager start &
DRIVER=$!
sleep 20
protractor protractor.conf.js
kill $FOREMAN
kill $DRIVER