'use strict';

const path = require('path')
const express = require('express')
const {Router} = require('express')


const router = Router()


router.use(express.static(path.join(__dirname, '../../public')))

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'new_post.html'))
})
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'login.html'))
})
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'signup.html'))
})


module.exports = router