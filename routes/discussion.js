const express = require('express')
const router = express.Router()

function allowAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    else{
        res.redirect('/accounts/login')
    }
}

router.get('/', allowAuthenticated, (req, res, next)=>{
    res.render('discuss_front.ejs')
})


module.exports = router