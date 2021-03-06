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
    var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat([{ access, token }])

    return user.save().then(() => {
        return token
    })
}

UserSchema.methods.removeToken = function (token) {
    var user = this

    return user.update({
        $pull: {
            tokens: { token }
        }
    })
}

///////////////////////////////////////////////////////
UserSchema.statics.findByToken = function (token) {
    var User = this
    var decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        console.log("ERROR:", e)
        return Promise.reject()
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

///////////////////////////////////////////////////////////////////////
UserSchema.statics.findByCredentials = function (email, password) {
    User = this
    console.log(email)
    console.log(password)

    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject()

        console.log(user)
        return new Promise((resolve, reject) => {

            bcryptjs.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    })
}

///////////////////////////////////////////////////////////////////////
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