const usersCollection = require('../db').collection('users')
const validator = require('validator')

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {

    // if not string make string
    if (typeof(this.data.username) != "string") {
        this.data.username = ""
    }
    if (typeof(this.data.email) != "string") {
        this.data.email = ""
    }
    if (typeof(this.data.password) != "string") {
        this.data.password = ""
    }
    // get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function() {

    // username check
    if (this.data.username == "" ) {
        this.errors.push("You must provide a username")
    }
    if (!this.data.username == "" && !validator.isAlphanumeric(this.data.username)) {
        this.errors.push("userName can only contains letters and numbers")
    }

    // email check
    if (!validator.isEmail(this.data.email)) {
        this.errors.push("You must provide a valid email")
    }

    // password check
    if (this.data.password == "" ) {
        this.errors.push("You must provide a password")
    }
    if (this.data.password.length >0 && this.data.password.length<6) {
        this.errors.push("Passwords must be at least 6 character")
    }
    if (this.data.password.length >20 ) {
        this.errors.push("Passwords cannot exceed 20 character")
    }
}

User.prototype.register = function() {

    // Step #1: Validate user data
    this.cleanUp() ;
    this.validate() ;

    // Step #2: if no error save to database
    if (!this.errors.length){
        usersCollection.insertOne(this.data)
    }

}

User.prototype.login = function() {
    return new Promise( ( resolve , reject ) => {
        this.cleanUp()
        usersCollection.findOne( {username : this.data.username} )
        .then( (attemptedUser) => {
            if (attemptedUser && attemptedUser.password == this.data.password) {
                resolve("Congrats!!!")
            }
            else {
                reject("Invalid username or password")
            }
        })
        .catch( () => {
            reject("Please try again later")
        } )
    })
}

module.exports = User