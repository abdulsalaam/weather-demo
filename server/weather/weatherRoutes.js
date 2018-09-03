/** created by @abdul */
'use strict'

const config = require('config')

const weatherHandler = require('./weatherHandler')
const weatherValidations = require('./weatherValidations')

const API_PATH = '/' + config.get('app.name') + '/api/1.0'

const routes = []

// GET /getWeatherByCityName
routes.push({
  path: API_PATH + '/getWeatherByCityName',
  method: 'GET',
  handler: weatherHandler.getWeatherByCityName,
  config: {
    tags: ['api'],
    validate: weatherValidations.getWeatherByCityName
  }
})

// GET /getWeatherByCityIds
routes.push({
  path: API_PATH + '/getWeatherByCityIds',
  method: 'GET',
  handler: weatherHandler.getWeatherByCityIds,
  config: {
    tags: ['api'],
    validate: weatherValidations.getWeatherByCityIds
  }
})

// GET /getWeatherForecast
routes.push({
  path: API_PATH + '/getWeatherForecast',
  method: 'GET',
  handler: weatherHandler.getWeatherForecast,
  config: {
    tags: ['api'],
    validate: weatherValidations.getWeatherForecast
  }
})

module.exports = routes
