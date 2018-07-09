const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema
const _ = require('lodash')
const bcryptjs = require('bcryptjs')

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    var user = this
    var access = 'auth'
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret_salt')

    user.tokens = user.tokens.concat([{ access, token }])

    return user.save().then(() => {
        return token
    })
}


UserSchema.statics.findByToken = function (token) {
    var User = this
    var decoded

    try {
        decoded = jwt.verify(token, 'secret_salt')
    } catch (e) {
        console.log("ERROR:", e)
        // return new Promise((resolve, reject) => {
        //     reject()
        // })
        return Promise.reject()
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}


UserSchema.pre('save', function (next) {
    var user = this

    if (user.isModified('password')) {

        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash
                // console.log(hash)
                next()
            })
        })

    } else {
        next()
    }

})




var User = mongoose.model('User', UserSchema)

module.exports = { User }












//////////////////////////////////////////////////
// var newUser = new User({
//     name: "Joe ",
//     email: "succinction@gmail.com"
// })

// newUser.save().then((doc)=>{
//     console.log('saved User: ', doc)
// }, (e)=>{
//     console.log('ERROR: ', e)
// })