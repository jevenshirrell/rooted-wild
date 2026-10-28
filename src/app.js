'use strict';

const express = require('express')
const {API_PREFIX} = require('./config/constants')
// routes
const routes = require('./routes')
const healthRoutes = require('./routes/health.routes')
const viewRoutes = require('./routes/views.routes.js')
// middleware
const reqLogger = require('./middleware/requestLogger.js')
const notFound = require('./middleware/notFound.js')
const errorHandler = require('./middleware/errorHandler.js')


const app = express()


// === LOGGER ===
app.use(reqLogger)
// === DATA ===
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true, limit:'10kb'}))

// === ROUTES ===
// app health 
app.use('/health', healthRoutes)

// front end
app.use('/', viewRoutes)

// API
app.use(API_PREFIX, routes)

// === ERRORS ===
app.use(notFound)
app.use(errorHandler)


module.exports = app