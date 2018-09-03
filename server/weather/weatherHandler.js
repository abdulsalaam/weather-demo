/** created by @abdul */
'use strict'

const boom = require('boom')
const httpStatus = require('http-status')

const weatherCtrl = require('./weatherCtrl')
const logger = require('../utils/logger')

const getWeatherByCityName = async function (req, res) {
  const cityName = req.query.cityName

  try {
    const data = await weatherCtrl.getWeatherByCityName(cityName)
    return res({
      name: data.name,
      coord: data.coord,
      weather: data.weather
    })
  } catch (error) {
    const errorMessage = `Failed to fetch weather for ${cityName}`
    !error.logged && logger.error(error, errorMessage)
    return res(boom.boomify(error, { statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: errorMessage }))
  }
}


const getWeatherByCityIds = async function (req, res) {
  const cityIds = req.query.cityIds

  try {
    const data = await weatherCtrl.getWeatherByCityIds(cityIds)
    return res({
      total: data.cnt,
      list: data.list
    })
  } catch (error) {
    const errorMessage = `Failed to fetch weather for ${cityIds}`
    !error.logged && logger.error(error, errorMessage)
    return res(boom.boomify(error, { statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: errorMessage }))
  }
}

const getWeatherForecast = async function (req, res) {
  const lat = req.query.lat
  const lon = req.query.lon

  try {
    const data = await weatherCtrl.getWeatherForecast(lat,lon)
    return res({
      total: data.cnt,
      list: data.list
    })
  } catch (error) {
    const errorMessage = `Failed to fetch weather for ${lat,lon}`
    !error.logged && logger.error(error, errorMessage)
    return res(boom.boomify(error, { statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: errorMessage }))
  }
}

module.exports = {
  getWeatherByCityName,
  getWeatherByCityIds,
  getWeatherForecast
}
