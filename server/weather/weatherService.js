'use strict'

const axios = require('axios')
const config = require('config')
const logger = require('../utils/logger')

const getWeatherByCityName = async function (cityName) {
  const options = {
    method: 'get',
    url: 'http://api.openweathermap.org/data/2.5/weather',
    params: {
      q: cityName,
      APPID: config.get('openWeather.apiKey')
    }
  }

  try {
    const response = await axios(options)
    return response.data
  } catch (error) {
    logger.error(error, `Failed to fetch weather for ${cityName}`)
    error.logged = true
    throw error
  }
}

const getWeatherByCityIds = async function (cityIds) {
  const options = {
    method: 'get',
    url: 'http://api.openweathermap.org/data/2.5/group',
    params: {
      id: cityIds,
      units:'metric',
      APPID: config.get('openWeather.apiKey')
    }
  }

  try {
    console.log('options:',options)
    const response = await axios(options)
   // console.log('response:',response)
    return response.data
  } catch (error) {
    logger.error(error, `Failed to fetch weather for ${cityIds}`)
    error.logged = true
    throw error
  }
}


const getWeatherForecast = async function (lat,lon) {
  const options = {
    method: 'get',
    url: 'http://api.openweathermap.org/data/2.5/forecast',
    params: {
      lat: lat,
      lon : lon,
      APPID: config.get('openWeather.apiKey')
    }
  }

  try {
    console.log('options:',options)
    const response = await axios(options)
    //console.log('response:',response)
    return response.data
  } catch (error) {
    logger.error(error, `Failed to fetch weather for ${lat,lon}`)
    error.logged = true
    throw error
  }
}

module.exports = {
  getWeatherByCityName,
  getWeatherByCityIds,
  getWeatherForecast
}
