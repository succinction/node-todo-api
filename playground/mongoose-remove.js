const { ObjectID } = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// var id = '5b41cc7159cb7936fccc0e8d'
var id = '5b41cc7159cb7936fccc0e8d'

if (!ObjectID.isValid(id)) console.log('ID not Valid')


// Todo.remove({}})
//     .then((todo) => {
//         if (!todo) return console.log('ERROR: Unable to find user by that id.')
//         console.log('Todo removed:', todo)
//     })
//     .catch((e) => console.log(e))


// Todo.findOneAndRemove({}})
//     .then((todo) => {
//         if (!todo) return console.log('ERROR: Unable to find user by that id.')
//         console.log('Todo removed:', todo)
//     })
//     .catch((e) => console.log(e))


Todo.findByIdAndRemove(id)
    .then((todo) => {
        if (!todo) return console.log('ERROR: Unable to find user by that id.')
        console.log('Todo removed:', todo)
    })
    .catch((e) => console.log("-ERROR: ",e))





