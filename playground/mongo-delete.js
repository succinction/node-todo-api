const { MongoClient } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log("ERROR: could not connect to the database.<<<:", err)
    console.log('Connected to the database.')

    const db = client.db('TodoApp')

    // deleteMany
    // db.collection('Todos').deleteMany({ game: 234 }).then((result) => {
        // console.log(result)
    // }, (err) => {
    //     console.log("ERROR:", err)
    // })

    // // deleteOne
    // db.collection('Todos').deleteOne({ user: 'Joe' }).then((result) => {
    //     console.log(result)
    // }, (err) => {
    //     console.log("ERROR:", err)
    // })

    // // findOneAndDelete
    db.collection('Users').findOneAndDelete({ name: 'Jill' })
    .then((result) => {
        console.log(result)
    }, (err) => {
        console.log("ERROR:", err)
    })

    client.close()
})


