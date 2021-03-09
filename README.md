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

### Native development
**2. Install dependencies**
```sh
$ npm install
```
**3. Add environment variables (you don't need to use `export` on OSX)**
```sh
$ export KEYCLOAK_AUTH_URL=https://your.sso.com/auth
$ export KEYCLOAK_CLIENT_ID=your-client-id
$ export KEYCLOAK_REALM=realm
$ export FORM_API_URL=https://form-api.example.com/
$ export REFDATA_API_URL=https://refdata-api.example.com/
$ export CERBERUS_API_URL=https://cerberus-api.example.com/
```
**4. Build development bundle** *(optional)*
```sh
$ npm run build:dev
```
**5. Start the application** *(optional)*
```sh
$ npm start
```

### Development with docker
**2. Build the application Docker container**
```sh
docker build -t cerberus-service .
```
**3. Run the resulting Docker container**
```sh
docker run --name cerberus-service -p 8080:8080 \
  --env KEYCLOAK_AUTH_URL=https://your.sso.com/auth \
  --env KEYCLOAK_CLIENT_ID=your-client-id \
  --env KEYCLOAK_REALM=realm \
  --env FORM_API_URL=https://form-api.example.com \
  --env REFDATA_API_URL=https://refdata-api.example.com \
  --env CERBERUS_API_URL=https://cerberus-api.example.com \
  cerberus-service
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
### Running UI tests (cypress tests)
There are two ways to run cypress tests, using the cypress test runner or running cypress tests using the command line.
(You will need the cerberus-service application running before triggering the Cypress tests)
By default tests run against local environment.

#### Running Cypress Test Runner
```sh
npm run cypress:runner
```
Once TestRunner launched, click on the interested spec inside folder cypress/integration/cerberus

#### Running Cypress tests using the command line

## Running all tests on local Environment, (It executes tests headless mode on Electron Browser)
```sh
npm run cypress:test:local
```

## Running all tests on Development Environment, (It executes tests headless mode on Electron Browser)
```sh
npm run cypress:test:dev
```

## Running a specific test
```sh
npm run cypress:test:local -- --spec cypress/integration/cerberus/login.spec.js
```