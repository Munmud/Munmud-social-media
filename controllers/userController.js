const User = require('../models/User')

exports.mustBeLoggedIn = function (req , res , next) {
    if ( req.session.user ){
        next()
    } else {
        req.flash('errors',"You must be logged in to perform that action")
        req.session.save( () => res.redirect('/') )

    }
}

exports.login = function (req , res) {
    let user = new User(req.body)
    
    user.login()
    .then( () => {
        req.session.user = {
            avater : user.avater,
            username: user.data.username,
            _id : user.data._id ,
        }
        req.session.save( () => res.redirect('/') )
    })
    .catch( e => {
        req.flash( 'errors' , e ) 
        req.session.save( () => res.redirect('/') )
    } )
}

exports.logout = function (req , res) {
    req.session.destroy( () => {
        res.redirect('/')
    } )
}

exports.register = function (req , res) {
    let user = new User(req.body)
    
    user.register()
    .then( () => {
        req.session.user = {
            avater : user.avater ,
            username : user.data.username,
            _id : user.data._id ,
        }
        req.session.save( () => res.redirect('/'))
    } )
    .catch ( (regErrors) => {
        regErrors.forEach ( (error) => {
            req.flash('regErrors' , error)
        } )
        req.session.save( () => res.redirect('/') )
    })

}

exports.home = function (req , res)  {
    if (req.session.user) {
        res.render('home-dashboard' )
    } else {
        res.render('home-guest', {
            errors : req.flash('errors') ,
            regErrors : req.flash('regErrors'),
        })
    }
}