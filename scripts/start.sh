#!/bin/sh

if [ $APP_NAME = "rest_server" ]
then
    exec node /app/src/transporters/rest/entrypoint.js
elif [ $APP_NAME = "sqs_workers" ]
then
    exec node /app/src/transporters/sqs/entrypoint.js
else
    echo "No entrypoint for this app name"
fi
