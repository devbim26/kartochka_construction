#!/bin/sh
envsubst '${SERVER_NAME} ${API_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec "$@"
echo "Configured nginx.conf:"
cat /etc/nginx/conf.d/default.conf
