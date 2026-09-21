const express = require('express')
const mongoose = require('mongoose')


const observationSchema = new mongoose.Schema({
    species:{type:String, required:true},
    location:{
        type:{type:String, enum:['Point'], required:true},
        coordinates:{type:[Number], required:true}
    },
    time:{type:Date, required:true},
    photos:{type:[String]},
    timesSeen:{type:Number, default:1},
    user:{type:String, required:true},
    visibility:{type:String, default:'private'},
    id:{type:Number, required:true}
}, {timestamps:true})
const Observation = mongoose.model("Observation", observationSchema)

const app = express()
app.use(express.json())

let nextId = 1


app.get('/health', (req, res) => {
    res.status(200).json({status:'ok'})
})

// CRUD Responses: Create, Read, Update, Delete
// READ --- 200/404
app.get('/observations', async (req, res) => {
    try {
        // uses mongoose find function and returns all records that use the model
        const obsvs = await Observation.find({})
        // response is all obsvs in the db in json format
        res.status(200).json(obsvs)    
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})
app.get('/observations/:id', async (req, res) => {
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
app.post('/observations', async (req, res) => {
    try {
        const obsv = await Observation.create({id:String(nextId++), ...req.body})
        res.status(201).json(obsv)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// UPDATE --- 200/404
app.patch('/observations/:id', async (req, res) => {
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
app.delete('/observations/:id', async (req, res) => {
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

module.exports = app