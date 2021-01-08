# cerberus-service
Cerberus frontend service for cerberus-api

## Requirements
* npm 6.9.0
* node v8.10.0

## Native development
Open your terminal and run the following commands from the project directory.

```sh
# install dependencies
$ npm install

# build js bundle in development mode
$ npm run build:dev

# start the application
$ npm start
```

## Development with Docker
Open your terminal and run the following commands from the project directory.

```sh
# build the application Docker container
docker build -t cerberus-service .

# run the resulting Docker container
docker run --name cerberus-service -p 8080:8080 cerberus-service
```

