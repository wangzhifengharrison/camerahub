const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const cameraRouter = require('./routes/camera');
const officeRouter = require('./routes/office');
const ruleRouter = require('./routes/rule');
const userRouter = require('./routes/user');
const alertRouter = require('./routes/alert');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser('SHOW ME THE CAMERA'));

//Session Configuration
//Change cookie . secure: false, to secure: true on HTTPS server
const MemoryStore = session.MemoryStore;
app.use(session({
    secret: 'SHOW ME THE CAMERA',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use(logger('dev'));
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({extended: false, limit: '25mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/camera', cameraRouter);
app.use('/office', officeRouter);
app.use('/rule', ruleRouter);
app.use('/user', userRouter);
app.use('/notification', alertRouter);

app.use(function(req, res, next) {
    res.locals.userID = req.session.userID;
    res.locals.username = req.session.username;
    console.log('MIDDLEWARE LOCALS VALUE USERID: ' + res.locals.userID);
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
