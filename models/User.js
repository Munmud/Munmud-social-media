const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection('users')
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

User.prototype.validate = function () {
    return new Promise( async (resolve , reject) => {

        // username check
        if (this.data.username == "" ) {
            this.errors.push("You must provide a username")
        }
        if (this.data.username.length >0 && this.data.username.length<2) {
            this.errors.push("username must be at least 2 character")
        }
        if (this.data.username.length >30 ) {
            this.errors.push("username cannot exceed 30 character")
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
        if (this.data.password.length >50 ) {
            this.errors.push("Passwords cannot exceed 50 character")
        }
    
        // if all valid check if it has already in the database
    
        if (this.data.username.length >2 && this.data.username.length<30 && validator.isAlphanumeric(this.data.username)) {
            let usernameExist = await usersCollection.findOne( {
                username : this.data.username
            })
            if (usernameExist){
                this.errors.push("That username already taken")
            }
        }
    
        if (validator.isEmail(this.data.email)) {
            let emailExist = await usersCollection.findOne( {
                email : this.data.email
            })
            if (emailExist){
                this.errors.push("That email already taken")
            }
        }

        resolve()
    })
    
   
}

User.prototype.register = function () {
    return new Promise (async (resolve , reject) => {
        

        // Step #1: Validate user data
        this.cleanUp() ;
        await this.validate() ;
    
        // Step #2: if no error save to database
        if (!this.errors.length){
    
            // hash user password
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password , salt) ;
            await usersCollection.insertOne(this.data)
            resolve()
        }
        else{
            reject(this.errors)
        }
        
        
    })
}

User.prototype.login = function() {
    return new Promise( ( resolve , reject ) => {
        this.cleanUp()
        usersCollection.findOne( {username : this.data.username} )
        .then( (attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password , attemptedUser.password)) {
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