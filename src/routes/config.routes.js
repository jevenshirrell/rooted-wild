'use strict';

const {cloudName, uploadPreset} = require('../config/env.js')
const path = require('path')
const {Router} = require('express');
const { sendSuccess } = require('../utils/apiResponse.js');


const router = Router()


router.get('/', (req, res) => {
    sendSuccess(res, { cloudName:cloudName, uploadPreset:uploadPreset })
})


module.exports = router