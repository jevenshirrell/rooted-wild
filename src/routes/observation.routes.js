'use strict';

const {Router} = require('express')
const {requireAuth} = require('../middleware/auth')
const obsvController = require('../controllers/observation.controller.js')

const router = Router()

router.route('/')
    .get(obsvController.getAll)
    .post(requireAuth, obsvController.create)
    
router.route('/:id')
    .get(obsvController.getOne)
    .put(obsvController.replace)
    .patch(obsvController.update)
    .delete(obsvController.remove)


module.exports = router