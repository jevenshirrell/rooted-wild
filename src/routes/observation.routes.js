const {Router} = require('express')
const Observation = require('../models/observation.js')


const router = Router()


// READ --- 200/404
router.get('/', async (req, res) => {
    try {
        // uses mongoose find function and returns all records that use the model
        const obsvs = await Observation.find({})
        // response is all obsvs in the db in json format
        res.status(200).json(obsvs)    
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})
router.get('/:id', async (req, res) => {
    try {
        // uses url id param to search db for obj
        const obsv = await Observation.find({id:req.params.id})
        if (!obsv) {
            return res.status(404).json({error:'Observation not found'})
        }
        res.status(200).json(obsv)    
    } catch (error) {
        res.status(500).json({error:'Observation not found'})
    }
})

// CREATE --- 201
router.post('/', async (req, res) => {
    try {
        const obsv = await Observation.create({id:String(nextId++), ...req.body})
        res.status(201).json(obsv)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// REPLACE
router.put('/:id', async (req, res) => {
    try {
        const obsv = await Observation.findOneAndReplace({id:req.params.id}, req.body)
        if (!obsv) {
            return res.status(404).json({error:'Observation not found'})
        }
        res.status(200).json(obsv)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// UPDATE --- 200/404
router.patch('/:id', async (req, res) => {
    try {
        const obsv = await Observation.findOneAndUpdate({id:req.params.id}, req.body)
        if (!obsv) {
            return res.status(404).json({error:'Observation not found'})
        }
        res.status(200).json(obsv)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// DELETE --- 204
router.delete('/:id', async (req, res) => {
    try {
        const obsv = await Observation.findOneAndDelete({id:req.params.id})
        if (!obsv) {
            return res.status(404).json({error:'Observation not found'})
        }
        // confirm removal of item
        res.status(204).send()
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})


module.exports = router