var mongoose = require('mongoose')
// var Schema = mongoose.Schema

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true})

module.exports = {mongoose}
