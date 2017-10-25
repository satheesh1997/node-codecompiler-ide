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
            res.render('discuss_front.ejs', {sendData})
        }
        else{
            sendData.status = true
            var dis = discussions
            res.render('discuss_front.ejs', {sendData, dis})
        }
    })
})

router.post('/add', allowAuthenticated, (req, res, next)=>{
    var data = {
        author: req.user.username,
        title: req.body.title,
        body: req.body.body,
        posted_date: new Date()
    }

    discuss = new discussion(data)

    discuss.save((err)=>{
        if(err){
            res.json({status: false, error: "Error occured while adding discussion!"})
            console.log(err)
        }
        else{
            res.json({status: true, msg: 'Discussion added successfully!'})
        }
    })
})

module.exports = router