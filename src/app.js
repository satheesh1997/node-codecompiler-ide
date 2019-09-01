/************************************************************************
*
*    Title: Code Lordz
*    Language: Nodejs
*    Database: Mongoose
*    Author: Satheesh Kumar D
*    Date: 18-10-2017
*    Code version: 1.0.2
*    Routes: 12
*    Models: 2
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
const port = 8000

//Mongo database connection
mongoose.Promise = global.Promise

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
}
console.log(process.env.MONGO_DB_URL);
const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(process.env.MONGO_DB_URL+"/codelordz", options).then(()=>{
        console.log('MongoDB is connected')
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
        setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry();

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
        user: req.user,
        query: req.query
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
