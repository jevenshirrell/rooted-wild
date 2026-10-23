'use strict'

const express = require('express')
const plantRoutes = require('./plant.routes')
const authRoutes = require('./auth.routes')


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/plants', plantRoutes)

// routes all additional url path addons past /api/v1/
module.exports = router