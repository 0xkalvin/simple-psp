#!/bin/sh

if [ $APP_NAME = "rest_server" ]
then
    # For simplicity, we're running migrations during server startup.
    # In a real production env, we should have a separated one-off task just for that.
    npm run migrate

    exec node /app/src/transporters/rest/entrypoint.js
elif [ $APP_NAME = "sqs_workers" ]
then
    exec node /app/src/transporters/sqs/entrypoint.js
else
    echo "No entrypoint for this app name"
fi
