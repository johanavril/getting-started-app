HOST_PORT ?= 3210
APP_PORT ?= 3110

format:
    npm run format

lint:
    npm run lint:fix

test:
    npm run test

run:
    docker compose up --build -d

smoke:
    curl --fail \
        --connect-timeout 5 \
        --max-time 10 \
        --retry 3 \
        --retry-delay 2 \
        --retry-max-time 30 \
        --retry-all-errors \
        http://localhost:$(HOST_PORT)/healthz

preflight: format lint test run
