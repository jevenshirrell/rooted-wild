const asyncHandler = require('../utils/asyncHandler')
const obsvService = require('../services/observation.service.js')


const getAll = asyncHandler(async (req, res) => {
    const obsvs = await obsvService.findAll()
    res.status(200).json({success:true, data:obsvs})    
})

const getOne = asyncHandler(async (req, res) => {
    const obsv = await obsvService.findOne(req.params.id)
    res.status(200).json({success:true, data:obsv})
})

const create = asyncHandler(async (req, res) => {
    const obsv = await obsvService.create(req.body)
    res.status(201).json({success:true, data:obsv})
})

const replace = asyncHandler(async (req, res) => {
    const obsv = await obsvService.replace(req.params.id, req.body)
    res.status(200).json({success:true, data:obsv})
})

const update = asyncHandler(async (req, res) => {
    const obsv = await obsvService.update(req.params.id, req.body)
    res.status(200).json({success:true, data:obsv})
})

const remove = asyncHandler(async (req, res) => {
    const obsv = await obsvService.remove(JSON.stringify(req.get('user')), req.params.id)
    res.status(204).send({success:true})
})

module.exports = {getAll, getOne, create, replace, update, remove}