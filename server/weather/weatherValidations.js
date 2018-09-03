/** created by @abdul */
'use strict'

const joi = require('joi')

const weatherValidations = {
  // GET /getWeatherByCityName
  getWeatherByCityName: {
    headers: {},
    query: {
      cityName: joi.string().trim().required().description('name of the city whose weather is to be fetched')
    },
    options: {
      allowUnknown: true
    }
  },
  getWeatherByCityIds: {
    headers: {},
    query: {
      cityIds: joi.string().trim().required().description('Ids of the cities whose weather is to be fetched')
    },
    options: {
      allowUnknown: true
    }
  },
  getWeatherForecast: {
    headers: {},
    query: {
      lat: joi.string().trim().required().description('lat the cities whose weather is to be fetched'),
      lon: joi.string().trim().required().description('lon the cities whose weather is to be fetched')
    },
    options: {
      allowUnknown: true
    }
  }
}

module.exports = weatherValidations
