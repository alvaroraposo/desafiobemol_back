#HOST=http://0.0.0.0:3000
HOST=https://5v01jp94bj.execute-api.us-east-1.amazonaws.com/dev/handler

curl --silent -X POST -H 'Content-Type: application/json' -d @../db/user.json $HOST/dev/handler