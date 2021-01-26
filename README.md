# cerberus-service
Cerberus frontend service for cerberus-api

## Requirements
* npm 6.9.0
* node v8.10.0

## Index
* [Getting started](#getting-started)
* [Native development](#native-development)
* [Development with docker](#development-with-docker)
*  [Tests in native development](#tests-in-native-development)
* [Linter in native development](#linter-in-native-development)

## Getting started

**1. Clone this repo**

## Native development
**2. Install dependencies**
```sh
$ npm install
```
**3. Build development bundle** *(optional)*
```sh
$ npm run build:dev
```
**4. Start the application** *(optional)*
```sh
$ npm start
```


## Development with docker
**2. Build the application Docker container**
```sh
docker build -t cerberus-service .
```
**3. Run the resulting Docker container**
```sh
docker run --name cerberus-service -p 8080:8080 cerberus-service
```

## Tests in native development

Setup your environment as described in [Native development](#native-development)

**3. Running jest tests**
```sh
npm test
```

## Linter in native development

Setup your environment as described in [Native development](#native-development)

**3. Running linter**
```sh
npm run lint -- <directory>
```
