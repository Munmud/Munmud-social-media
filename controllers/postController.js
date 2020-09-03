exports.viewCreateScreen = function (req , res) {
    res.render('create-post' , {
        username : req.session.user.username,
        avater : req.session.user.avater ,
    })
}