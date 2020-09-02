const User = require('../models/User')

exports.login = function (req , res) {
    let user = new User(req.body)
    
    user.login()
    .then( result => {
        req.session.user = {
            facouriteColor: "blue" ,
            userName: user.data.username,
        }
        res.send(result)
    })
    .catch( e => {
        res.send(e)
    } )
}

exports.logout = function () {

}

exports.register = function (req , res) {
    let user = new User(req.body)
    
    user.register()

    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send("Congratulations on sign up")
    }
}

exports.home = function (req , res)  {
    if (req.session.user) {
        res.send("Welcome to actual application")
    } else {
        res.render('home-guest')
    }
}