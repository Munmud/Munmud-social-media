const express = require('express')
const app = express()

let port = process.env.PORT
if (port == null || port =="") port = 3000

app.use(express.static('public'))
app.set('views' , 'views')
app.set('view engine','ejs')

app.get('/' , (req , res) => {
    res.render('home-guest')
})

app.listen(port)