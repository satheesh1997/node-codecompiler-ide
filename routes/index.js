const express = require('express')
const router = express.Router()
const passport = require('passport')
const Student = require('../models/student')

function allowAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/accounts/login')
}

router.get('/', allowAuthenticated, (req, res, next)=>{
    res.render('home')
})

router.get('/playground', allowAuthenticated, (req, res, next)=>{
    res.render('playground')
})


router.get('/accounts/login', (req, res, next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    res.render('login')
})

router.post('/accounts/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/accounts/login'
}))

router.get('/accounts/register', (req, res, next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    res.render('register', {
        error: ''
    })
})

function isDomainMail(email){
    var re = /^\w+([\.-]?\w+)*@skct.edu.in$/;
    return re.test(email)
}

router.post('/accounts/register', (req, res, next)=>{
    var ver_email = req.body.email
    if(isDomainMail(ver_email)){
        Student.register(new Student({ username : req.body.username, name: req.body.name, email: ver_email }), req.body.password, function(err, user) {
            if (err) {
                return res.render('register', { user : user, error:'Your Account Exists' });
            }
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            })
        })
    }
    else{
        res.render('register', {
            error: 'Enter your domain email'
        })
    }
})

router.get('/accounts/logout',  allowAuthenticated, (req, res, next)=>{
    req.logout();
    res.redirect('/');
})

module.exports = router