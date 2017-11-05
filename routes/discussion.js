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

router.get('/view/:id' ,allowAuthenticated, (req, res, next)=>{

    var sendData = {
        route: 'Fetch discussion from server!'
    }

    discussion.findOne({_id: req.params.id}, (err, discussion)=>{
        if(err){
            sendData.status = false
            sendData.error = 'Error while fetching discussion from the database.<br> Kindly contact the administrator!'
        }
        else{
            sendData.status = true
            sendData.discussion = discussion
        }
        return res.render('discussion.ejs', {sendData})
    })
})

router.post('/addsolution', allowAuthenticated, (req, res, next)=>{
    var data = {
        id: req.body.discuss,
        solution: req.body.solution
    }
    discussion.findOne({_id: data.id}, (err, discus)=>{
        if(err){
            data.status = false
            data.error = 'Error while adding solution to the discussion. Kindly contact the administrator!'
        }
        else{
            var solution = {
                posted_by: req.user.username,
                comment: data.solution
            }
            console.log(discus)
            discus.comments.push(solution)
            discus.save()
            data.status = true
        }
        return res.json(data)
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