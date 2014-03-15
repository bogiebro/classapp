trap 'kill -HUP 0' EXIT
export NODE_ENV=development
eval $(cat publicvars) ./node_modules/.bin/brunch watch &
eval $(cat publicvars .env) npm start
