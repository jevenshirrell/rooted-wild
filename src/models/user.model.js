'use strict'

/** User schema */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {ROLE_VALUES, ROLES, AUTH} = require('../config/constants')


const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, 'name require'],
            trim:true,
            maxlength:[60, 'name cannot exceed 60 characters']
        },
        email:{
            type:String,
            required:[true,'email required'],
            // unique is an index, not a validator, mongoose wont throw validation errors for dupes
            // failure will result in 409
            unique:true,
            lowercase:true,
            match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please provide a valid email']
        },
        password:{
            type:String,
            required:[true, 'password required'],
            minlength:[8, 'password must be at least 8 characters long'],
            // keeps hash out of every result, unless specifically asked for w/ .select('+password')
            // login page will be an exception
            select:false
        },
        role:{
            type:String,
            enum:{values:ROLE_VALUES, message:`{Value} is not a valid role`},
            default:ROLES.USER
        }
    }, {
        timestamps:true,
        toJSON:{
            virtuals:true,
            versionKey:false,
            transform(doc, ret) {
                ret.id = ret._id
                // second line of def for pwd hash, login will need to load it on purpose and send the record back in its res
                delete ret._id
                delete ret.password
                return ret
            }
        },
        toObject:{virtuals:true}
    }
)

/** DON'T EVER STORE PASSWORDS UNENCRYPTED ON YOUR DB 
 * one leak can give an attacker every user's info
 * YOU CAN BE LEGALLY LIABLE FOR NOT SECURING INFORMATION
 * 
 * bcrypt will encrypt user pwds
 * other info to encrypt:
 *  address, ssn, phone #, id (if not natively random), banking info
 * 
 * this means that you as the admin will not be able to give the user a pwd
 * 
 * isModified check matters, runs on every save, w/o it the pwd would rehash after every change locking the user out
*/
userSchema.pre('save', async function hasPassword() {
    if (!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, AUTH.SALT_ROUNDS)
})


userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}


module.exports = mongoose.model('User', userSchema)