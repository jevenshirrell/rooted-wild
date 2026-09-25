const express = require('express')
// const mongoose = require('mongoose')
const obsvRoutes = require('./routes/observation.routes.js')
const viewRoutes = require('./routes/views.routes.js')
const configRoutes = require('./routes/config.routes.js')


const app = express()
app.use(express.json())


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

// api 404
app.all("/api/v1/*", (req, res) => {
    res.status(404).json({success:false, error:{message:"Route not found"}})
})

module.exports = app