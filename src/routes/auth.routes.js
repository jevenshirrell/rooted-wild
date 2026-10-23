'use strict'

const express = require('express')
const authController = require('../controllers/auth.controller')
const {requireAuth} = require('../middleware/auth')


const router = express.Router()

// Public Routes: can't be logged in yet when you're asking to login
router.post('/register', authController.register)
router.post('/login', authController.login)

// Protected routes: requireAuth runs first and either sets req.user or ends w/ 401
router.get('/me', requireAuth, authController.me)


module.exports = router