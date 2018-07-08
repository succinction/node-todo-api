const { ObjectID } = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

var id = '5b41cc7159cb7936fccc0e8d'

if (!ObjectID.isValid(id)) console.log('ID not Valid')



Todo.findById(id)
    .then((user) => {
        if (!user) return console.log('ERROR: Unable to find user by that id.')
        console.log('Todo ById:', user)
    })
    .catch((e) => console.log(e))




// Todo.find({_id:id})
// .then((todos) => {
//     console.log('Todos:', todos)
// })

// Todo.findOne({_id:id})
// .then((todo) => {
//     console.log('Todo:', todo)
// })

// Todo.findById(id)
// .then((todo) => {
//     if (!todo) return console.log('ERROR: No Todo found by that id.')
//     console.log('Todo ById:', todo)
// })
// .catch((e)=>console.log(e))



