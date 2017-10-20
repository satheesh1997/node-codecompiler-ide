const express = require('express')
const router = express.Router()
const request = require('request')
const playground = require('../models/playground')

router.get('/', (req, res, next)=>{
    var status = {
        status: 'success',
        msg: 'Compiler Working Properly'
    }
    res.json(status)
})

router.post('/saveprogram', (req, res, next)=>{
    var username = req.user.username
    var code = req.body.code
    var language = req.body.language
    if(req.isAuthenticated()){
        playground.findOne({username: username}, (err, program)=>{
            if(err){
                res.json({
                    status: false,
                    error: err
                })
            }
            else{
                if(!program){
                    program = new playground({
                        username: username,
                        code: code,
                        language: language
                    })
                }
                else{
                    program.code = code
                    program.language = language
                }
                program.save((err)=>{
                    if(err){
                        res.json({status: false, error: err})
                    }
                    else{
                        res.json({status: true, msg: 'Program Saved!'})
                    }
                })
            }
        })
    }
    else{
        res.json({status: false, msg: 'User Not Authenticated'})
    }
})

router.get('/mycode', (req, res, next)=>{
    if(req.isAuthenticated()){
        playground.findOne({username: req.user.username}, (err, program)=>{
            if(err){
                res.json({status: false, msg: err})
            }
            else{
                if(program == null){
                    res.json({
                        status: false,
                        msg: 'No Saved Program Found For UserName'
                    })
                }
                else{
                    res.json({
                        status: true,
                        msg: 'Program Found For User',
                        code: program.code,
                        language: program.language
                    })
                }
            }
        })
    }
    else{
        res.json({status: false, msg: 'User Not Authenticated'})
    }
})

router.post('/compile', function(req, res, next) {
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/json'
    }

    var test = [req.body.testcase_1,req.body.testcase_2];
    
    var post_data = {
        source: req.body.source,
        lang: req.body.lang,
        testcases: JSON.stringify(test),
        api_key: "hackerrank|1488982-2006|6ba9952a864a280fc26947744153d8e41952795b"
    }

    var options = {
        url: 'http://api.hackerrank.com/checker/submission.json',
        method: 'POST',
        headers: headers,
        form: post_data
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(JSON.parse(body))
        }
        else{
    	    res.send(error);
        }
    })
})

module.exports = router