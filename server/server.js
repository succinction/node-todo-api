require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

var { mongoose } = require('./db/mongoose')
var { User } = require('./models/user')
var { Todo } = require('./models/todo')
var { authenticate } = require('./middleware/authenticate')

var app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todo', authenticate, (req, res) => {
    console.log(req.body)
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })
    todo.save()
        .then((doc) => {
            res.send(doc)
        }, (e) => {
            res.status(400).send(e)
        })
})

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    })
        .then((todo) => {
            res.send({ todo })
        }, (e) => {
            res.status(400).send(e)
        })
})

app.get('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id
    console.log('id requested:', id)
    if (!ObjectID.isValid(id)) return res.status(404).send()  //console.log('ID not Valid')

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    })
        .then((todo) => {
            if (!todo) return res.status(404).send() // console.log("No Todo returned")
            res.send({ todo })
        }, (e) => {
            res.status(400).send()
        })
})

app.delete('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id
    if (!ObjectID(id)) return res.status(404).send()  // console.log('Not a Valid ID ')

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    })
        .then((todo) => {
            if (!todo) return res.status(404).send()  // console.log('ERROR: Unable to find user by that id.')
            console.log('Todo removed:', todo)
            res.send({ msg: 'Todo removed:', todo_: todo })
        }).catch((e) => res.status(400).send())  // console.log("-ERROR: ", e))

})

app.patch('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed'])
    if (!ObjectID.isValid(id)) return res.status(404).send()  //console.log('ID not Valid')

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) return res.status(404).send()
        res.send({ todo })
    })
})

///////////////////////////////////////////////////// USER ///////////////////////////////////
app.post('/users', (req, res) => {
    console.log(req.body)
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()
        // res.send(user)
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(body.email, body.password).then((user) => {

        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user)
        })

    }).catch((e) => {
        res.status(400).send()
    })
})

//////////////////////////////////////////////////////////////////////
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, () => {
        res.status(400).send()
    })
})



//////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////// LISTEN
app.listen(port, () => {
    console.log(`Started server on port ${port}`)
})

module.exports = { app }
















////////////////////////////////////////////////////////////////////////////////////////////////////

// var mongoose = require('mongoose')
// var Schema = mongoose.Schema

// mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true})


///////////////////////////////////////////// TODO
// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String, 
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// })

// var newTodo = new Todo({
//     text: "fifth to do",
//     completedAt: 123123987
// })

// newTodo.save().then((doc)=>{
//     console.log('saved todo: ', doc)
// }, (e)=>{
//     console.log('ERROR: ', e)
// })


//////////////////////////////////////////////// USER
// var userSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true
//     }
// })

// var User = mongoose.model('User', userSchema)

// var newUser = new User({
//     name: "Joe ",
//     email: "succinction@gmail.com"
// })

// newUser.save().then((doc)=>{
//     console.log('saved User: ', doc)
// }, (e)=>{
//     console.log('ERROR: ', e)
// })


// set up a User schema
// email - required - trim it  - set type - set minlength to 1


