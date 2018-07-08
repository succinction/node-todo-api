const { MongoClient, ObjectId } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log("ERROR: could not connect to the database.<<<:", err)
    console.log('Connected to the database.')

    const db = client.db('TodoApp')

    // db.collection('Todos').findOneAndUpdate({
    //     _id: ObjectId("5b413cb934a7c02004d30aaf")
    // }, {
    //     $inc: {
    //         games: 1
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // }, (err) => {
    //     console.log("ERROR:", err)
    // })

    db.collection('Todos').findOneAndUpdate({
        _id: ObjectId("5b413cb934a7c02004d30aaf")
    }, {
        $set: {
            user: 'Mead'
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result)
    }, (err) => {
        console.log("ERROR:", err)
    })

    client.close()
})


