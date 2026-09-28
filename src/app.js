const express = require('express')
// routes
const obsvRoutes = require('./routes/observation.routes.js')
const viewRoutes = require('./routes/views.routes.js')
const configRoutes = require('./routes/config.routes.js')
// middleware
const reqLogger = require('./middleware/requestLogger.js')
const notFound = require('./middleware/notFound.js')
const errorHandler = require('./middleware/errorHandler.js')


const app = express()
app.use(express.json())

// === LOGGER ===
app.use(reqLogger)

// === ROUTES ===
// app health 
app.get('/health', (req, res) => {
    res.status(200).json({status:'ok'})
})

// front end
app.use('/', viewRoutes)

// CRUD Responses: Create, Read, Update, Delete
app.use('/api/v1/observations', obsvRoutes)

// api config
app.use('/api/v1/config', configRoutes)

// === ERRORS ===
app.use(notFound)
app.use(errorHandler)


module.exports = app