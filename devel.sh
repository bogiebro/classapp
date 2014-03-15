trap 'kill -HUP 0' EXIT
export NODE_ENV=development
eval $(cat .env) ./node_modules/.bin/brunch watch &
eval $(cat .env) npm start
