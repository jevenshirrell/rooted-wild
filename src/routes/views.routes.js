const path = require('path')
const express = require('express')
const {Router} = require('express')


const router = Router()


router.use('/', express.static(path.join(__dirname, '../../public')))

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'new_post.html'))
})


module.exports = router