const {cloudName, uploadPreset} = require('../config/env.js')
const path = require('path')
const {Router} = require('express')


const router = Router()


router.get('/', (req, res) => {
    res.json({
        success:true,
        data:{
            cloudName:cloudName,
            uploadPreset:uploadPreset
        }
    })
})


module.exports = router