const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todo = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todo)
  }).then(() => done())
})

describe('POST /todo', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text'

    request(app)
      .post('/todo')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text}).then((todo) => {
          expect(todo.length).toBe(1)
          expect(todo[0].text).toBe(text)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todo')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find().then((todo) => {
          expect(todo.length).toBe(2)
          done()
        }).catch((e) => done(e))
      })
  })
})

// todos
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todo/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todo/${todo[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todo[0].text)
      })
      .end(done)
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString()

    request(app)
      .get(`/todo/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todo/123abc')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todo/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todo[1]._id.toHexString()

    request(app)
      .delete(`/todo/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist()
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString()

    request(app)
      .delete(`/todo/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todo/123abc')
      .expect(404)
      .end(done)
  })
})




/////////////////////////////////////////////////


// const expect = require('expect')
// const request = require('supertest')

// const {app} = require('./../server')
// const {Todo} = require('./../models/todo')


// beforeEach((done)=>{
//     Todo.remove({}).then(() => done())
// })



// describe('POST /todo', () => {
//     it ('should create a todo', (done)=>{
//         var text = 'Test todo text'
//         request(app)
//         .post('/todo')
//         .send({text})
//         .expect(200)
//         .expect((res => {
//             expect(res.body.text).toBe(text)
//         }))
//         .end((err, res) => {
//             if (err) return done(err)

//             Todo.find().then((todo)=> {
//                 expect(todo.length).toBe(1)
//                 expect(todo[0].text).toBe(text)
//                 done()
//             }).catch((e)=>done(e))
//         })
//     })
// })



