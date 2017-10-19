const express = require('express')
const router = express.Router()
const discussion = require('../models/discussion')

function allowAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    else{
        res.redirect('/accounts/login')
    }
}

router.get('/', allowAuthenticated, (req, res, next)=>{
    
    var sendData = {
        route: 'Fetch all discussions and serve them'
    }

    discussion.find({}, (err, discussions)=>{
        if(err){
            sendData.status = false
            sendData.error = 'Error while fetching discussions for the database.<br> Kindly contact the administrator.'
        }
        else{
            sendData.status = true
            sendData.discussions = discussions
        }
    })
    res.render('discuss_front.ejs', {sendData})
})

module.exports = router