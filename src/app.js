const express = require('express')
// const mongoose = require('mongoose')
const obsvRoutes = require('./routes/observation.routes.js')
const viewRoutes = require('./routes/views.routes.js')


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

module.exports = app