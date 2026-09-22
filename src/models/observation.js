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


module.exports = mongoose.model("Observation", observationSchema)