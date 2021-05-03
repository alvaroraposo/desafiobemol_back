TOKEN=$1

echo "Token: $TOKEN"

curl \
    --silent \
    -H "Authorization:$TOKEN" \
    $HOST/dev/private \
    | xargs echo "Private API: $1"
echo