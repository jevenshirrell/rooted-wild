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
    .put(requireAuth, obsvController.update)
    .patch(requireAuth, obsvController.update)
    .delete(requireAuth, obsvController.remove)


module.exports = router