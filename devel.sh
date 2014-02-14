trap 'kill -HUP 0' EXIT
export NODE_ENV=development
./node_modules/.bin/brunch watch &
foreman start