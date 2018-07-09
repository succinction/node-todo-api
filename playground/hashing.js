// const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')


var data = {
    id: 10
}


var token = jwt.sign(data, 'server_secret_salt')

console.log(token)


var decoded =  jwt.verify(token, 'server_secret_salt')
console.log('decoded:', decoded)











// var message = 'MyMessage'
// var hash = SHA256(message).toString()

// console.log('Message:', message)
// console.log('Hash:', hash)

// var data = {
//     id: 4
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'server_secret+salt').toString()
// }

// ///////////////  TEST
// // token.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(data) + 'server_secret+salt').toString()
// var console_message = (resultHash === token.hash) ? 'Data was not changed.' : 'Data was changed. Do not trust!'
// console.log(console_message)




