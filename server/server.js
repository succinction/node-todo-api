var express = require('express')
var bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

var { mongoose } = require('./db/mongoose')
var { User } = require('./models/user')
var { Todo } = require('./models/todo')

var app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todo', (req, res) => {
    console.log(req.body)
    var todo = new Todo({
        text: req.body.text
    })
    todo.save()
        .then((doc) => {
            res.send(doc)
        }, (e) => {
            res.status(400).send(e)
        })
})

app.get('/todos', (req, res) => {
    Todo.find()
        .then((todo) => {
            res.send({ todo })
        }, (e) => {
            res.status(400).send(e)
        })
})

app.get('/todo/:id', (req, res) => {
    var id = req.params.id
    console.log('id requested:', id)
    if (!ObjectID.isValid(id)) console.log('ID not Valid')
    Todo.findById(id)
        .then((todo) => {
            if (!todo) return res.status(404).send() // console.log("No Todo returned")
            res.send({ todo })
        }, (e) => {
            res.status(400).send()
        })
})


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


