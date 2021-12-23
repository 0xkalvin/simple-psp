#!/bin/bash
set -x

cd /docker-entrypoint-initaws.d

awslocal sqs create-queue --queue-name payables-creation-queue --attributes file://payables-queue.json

awslocal sqs create-queue --queue-name payables-settlement-queue --attributes file://payables-queue.json

awslocal sqs create-queue --queue-name transactions-settlement-queue --attributes file://payables-queue.json

set +x
