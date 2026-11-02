# Getting started

This repository is a sample application for users following the getting started guide at https://docs.docker.com/get-started/.

The application is based on the application from the getting started tutorial at https://github.com/docker/getting-started

## Run the app

```sh
docker compose up --watch
```

specify `HOST_PORT` to specify the port exposed in the host machine
specify `APP_PORT` to specify the port used to listen the app in the container
example to listen the app on 3100 and expose to host port 3200

```sh
HOST_PORT=3200 APP_PORT=3100 docker compose up --watch
```
