'use strict';

const mongoose = require('mongoose')


const observationSchema = new mongoose.Schema({
    species:{
        type:String,
        required:[true, 'species required'],
        trim:true,
        minlength:[2, 'species must be at least 2 characters long'],
        maxlength:[100, 'species cannot exceed 100 characters']
    },
    location:{
        type:{
            type:String,
            enum:{values:['Point'], message:'{VALUE} is not a valid location type'},
            required:[true, 'location type required']
        },
        coordinates:{
            latitude:{
                type:Number,
                required:[true, 'latitude required'],
                min:[-90, 'latitude must be at least -90'],
                max:[90, 'latitude cannot exceed 90']
            },
            longitude:{
                type:Number,
                required:[true, 'longitude required'],
                min:[-180, 'longitude must be at least -180'],
                max:[180, 'longitude cannot exceed 180']
            }
        }
    },
    time:{
        type:Date,
        required:[true, 'observation time required'],
        // a function is re-evaluated on every validation, so "now" stays current
        max:[() => new Date(), 'observation time cannot be in the future']
    },
    photos:[
        {
            url:{
                type:String,
                required:[true, 'photo url required'],
                trim:true,
                maxlength:[2048, 'photo url cannot exceed 2048 characters']
            },
            publicId:{
                type:String,
                required:[true, 'photo publicId required'],
                trim:true,
                maxlength:[200, 'photo publicId cannot exceed 200 characters']
            }
        }
    ],
    // TODO: add to user stats page later
    // timesSeen:{
    //     type:Number,
    //     default:1,
    //     min:[1, 'timesSeen must be at least 1'],
    //     max:[100000, 'timesSeen cannot exceed 100000']
    // },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null,
        /* indexing allows for faster search and other queries, creates sorted map for the database to force better searches */ 
        index:true
    }
}, {
    timestamps:true,
    toJSON:{
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            return ret
        }
    }
})


module.exports = mongoose.model("Observation", observationSchema)