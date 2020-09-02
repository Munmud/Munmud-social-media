const mongodb = require('mongodb')

const connectionString = 'mongodb+srv://toDoAppUser:myPass@cluster0.32yrq.mongodb.net/Munmud_social_media?retryWrites=true&w=majority'


mongodb.connect(  connectionString , {useNewUrlParser : true , useUnifiedTopology: true},  function (err , client){
    
    module.exports = client.db()
    const app = require('./app')

    let port = process.env.PORT
    if (port == null || port =="") port = 3000

    app.listen(port)
})