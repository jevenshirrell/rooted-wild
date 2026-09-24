const {Router} = require('express')
const obsvController = require('../controllers/observation.controller.js')

const router = Router()


// READ --- 200/404
router.get('/', obsvController.getAll)
router.get('/:id', obsvController.getOne)

// CREATE --- 201
router.post('/', obsvController.create)

// REPLACE
router.put('/:id', obsvController.replace)

// UPDATE --- 200/404
router.patch('/:id', obsvController.update)

// DELETE --- 204
router.delete('/:id', obsvController.remove)


module.exports = router