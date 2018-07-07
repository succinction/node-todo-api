const {MongoClient, Object} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
    if (err) return console.log("ERROR: could not connect to the database.<<<:", err)
    console.log('Connected to the database.')

    const db = client.db('TodoApp')

    db.collection('Todos').find({user:'Joe'}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log("ERROR:", err)
    })

    client.close()

})




