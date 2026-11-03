#!/bin/bash

set -euo pipefail

cleanup() {
    result=$?
    trap - EXIT
    set +e

    docker compose -p preflight-getting-started-app logs

    docker compose -p preflight-getting-started-app down

    exit "$result"
}

trap cleanup EXIT

npm run format:check
npm run lint
npm run test

HOST_PORT=${HOST_PORT:-3210} APP_PORT=${APP_PORT:-3110} docker compose -p preflight-getting-started-app up --build -d --wait

node script/smoke-test.js "http://localhost:${HOST_PORT:-3210}/healthz"
