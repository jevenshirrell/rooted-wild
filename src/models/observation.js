const mongoose = require('mongoose')


const observationSchema = new mongoose.Schema({
    species:{type:String, required:true},
    location:{
        type:{type:String, enum:['Point'], required:true},
        coordinates:{
            latitude:{type:Number, required:true},
            longitude:{type:Number, required:true}
        }
    },
    time:{type:Date, required:true},
    photos:{type:[String]},
    timesSeen:{type:Number, default:1},
    user:{
        name:{type:String, default:""},
        uid:{type:mongoose.SchemaTypes.ObjectId, default:new mongoose.Types.ObjectId()}
    },
    id:{type:Number, default:0}
}, {timestamps:true})


module.exports = mongoose.model("Observation", observationSchema)