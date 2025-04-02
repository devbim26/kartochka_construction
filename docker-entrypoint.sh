#!/bin/sh
envsubst '${SERVER_NAME} ${API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec "$@"
