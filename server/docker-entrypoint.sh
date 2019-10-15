#!/bin/bash
set -xe

envsubst < /app/client/config.js.template > /app/client/public/script/config.js

exec "$@"
