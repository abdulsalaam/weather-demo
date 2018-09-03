# Weather Demo | Hapi based REST application boilerplate, uses async/await
## Overview

A lean application for building RESTful APIs (Microservice) in Node.js using [hapi.js](https://github.com/hapijs/hapi).

## Features          
| Uses latest ES8/ES2017 features (async/await)                                                   
| Uses latest ES7 and ES8 features including async/await  |
## Requirements
 - [node.js](https://nodejs.org/en/download/current/) >= `8.4.0`
 - [yarn](https://yarnpkg.com/en/docs/install) >= `0.27.5`
 
## Getting Started
 $ yarn npm install | npm install
# Start Server
# Set environment variables defined in `config/custom-environment-variables.json` like `OPEN_WEATHER_API_KEY=xxx`
$ yarn start |  npm start

# Try GET /ping to make sure server is up
$ curl http://localhost:3030/ping

# Run Tests
$ yarn test | npm test

## Environment Configuration
environment.
- `config/custom-environment-variables` is used to read values from environment variables. For ex. if `APP_PORT` env var is set it can be accessed as `config.get('app.port')`.

## Deployment
- Simply set environment variables defined in `bin/sample.dev.env` in your own environment (AWS, Heroku etc) and `yarn start`

## Documentation
- `hapi-swagger` self documents all the APIs.
- Visit `http://localhost:3030/documentation` to access the documentation after starting the server.
