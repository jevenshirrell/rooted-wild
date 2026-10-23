'use strict'

const express = require('express')
const obsvRoutes = require('./observation.routes')
const authRoutes = require('./auth.routes')
const configRoutes = require('./config.routes')


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/observations', obsvRoutes)
router.use('/config', configRoutes)

// routes all additional url path addons past /api/v1/
module.exports = router