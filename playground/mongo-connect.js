const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log('Unable to connected to mongodb sever')
    console.log('Connected to mongodb sever')

    const db = client.db("TodoApp")

    db.collection('Todos').insertOne({
        user: "Jill",
        games: 367,
        completed: true
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert todo')
        }
        console.log(JSON.stringify(res.ops, undefined, 2))
    })

    client.close()

})


