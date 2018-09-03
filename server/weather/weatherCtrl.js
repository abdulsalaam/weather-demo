/** created by @abdul */
'use strict'

const weatherService = require('./weatherService')

const getWeatherByCityName = async function (cityName) {
  return weatherService.getWeatherByCityName(cityName)
}

const getWeatherByCityIds = async function (cityIds) {
  return weatherService.getWeatherByCityIds(cityIds)
}

const getWeatherForecast = async function (lat,lon) {
  return weatherService.getWeatherForecast(lat,lon)
}

module.exports = {
  getWeatherByCityName,
  getWeatherByCityIds,
  getWeatherForecast
}
