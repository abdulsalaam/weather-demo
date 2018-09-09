'use strict'

const Hapi = require('hapi')
const config = require('config')

const routes = require('./routes')
const plugins = require('./plugins')
const logger = require('./server/utils/logger')

const Path = require('path');
const Inert = require('inert');

const server = new Hapi.Server()


server.connection({
  port: config.get('app.port'),
  routes: {
    files: {
        relativeTo: Path.join(__dirname, 'public')
    }
 }
})


const init = async () => {
  // register static content plugin
  await server.register(Inert);

  // index route / homepage
  server.route([{
    method: 'GET',
    path: '/',
    handler: {
      file: 'index.html'
    }
  },
  {
    method: 'GET',
    path: '/home',
    handler: {
      file: 'home.html'
    }
  },// Images

  {
      method: 'GET',
      path: '/img/{assetpath*}',
      handler: {
          directory: {
              path: './img'
          }
      }
  },

  // Scripts

  {
      method: 'GET',
      path: '/js/{assetpath*}',
      handler: {
          directory: {
              path: './js'
          }
      }
  },

  // Styles

  {
      method: 'GET',
      path: '/css/{assetpath*}',
      handler: {
          directory: {
              path: './css/'
          }
      }
  }
]);
  

};

// attach routes here
server.route(routes)

// register plugins
const registerPlugins = async () => {
  try { 
    await server.register(plugins)
  } catch (error) {
    logger.error(error, 'Failed to register hapi plugins')
    throw error
  }
}

init()
registerPlugins()

// export modules
module.exports = server
