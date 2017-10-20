/************************************************************************
* 
*    Title: Web Besed Smart Program Compiler
*    Language: Nodejs
*    Organisation: Code Lordz
*    Author: Satheesh Kumar D
*    Date: 18-10-2017
*    Code version: 0.0.1
*    Git Repository: https://github.com/Code-Lordz/Code_Compiler
*    Description: This is a simple web based code compiler that can
*                 Compile your code and match with the testcases provided.
*
****************************************************************************/

const express = require('express')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//Initialize application
const app = express()
const port = 3000

//Mongo database connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/onlinecompiler2')
let db = mongoose.connection
db.once('open' ,()=>{
    console.log('Connected to MongodB!')
})
db.on('error', (err)=>{
    console.log(err)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//Favicon Setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//Static files
app.use(express.static(path.join(__dirname, 'public')))

//Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Logger Middleware
app.use(logger('dev'))

//Cookie Parser Middleware
app.use(cookieParser())

//Express Session Middleware
app.use(session({
    secret: 'Satheesh-Kumar-10-10-1997-India',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//App locals
app.use((req, res, next)=>{
    res.locals={
        site:{
            title: 'Code Lordz',
            description: 'We provide you the simple web based offline code compiler where you can execute the programs and verify the result.'
        },
        user: req.user
    }
    next()
})

const Student = require('./models/student');
passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

//Index Routes
const index = require('./routes/index')
app.use('/', index)

//Online Compiler Routes
const compiler = require('./routes/compiler')
app.use('/compiler', compiler)

//Discussion Routes
const discussion = require('./routes/discussion')
app.use('/discuss', discussion)


app.listen(port, function() {
    console.log('App listening on port '+port+'!');
})