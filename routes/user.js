const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/login', function (req, res, next) {
    res.render('login', {ErrorInfo: ''});
});

router.post('/login', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        //todo: Hash the password
        db.query('SELECT * FROM user WHERE userAccount = ? AND userPassword = ?', [username, password], function (error, results, fields) {
            try {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = results[0].userName;
                    req.session.userID = results[0].userID;
                    //res.locals.userID = req.session.userID;
                    //res.locals.username = req.session.username;
                    res.redirect('/');
                } else {
                    res.render('login', {ErrorInfo: 'Username and Password not match!'});
                }
            } catch (e) {
                res.render('login', {ErrorInfo: 'Internal Service Error!'});
            }
        });
    } else {
        res.render('login', {ErrorInfo: 'Please enter Username and Password!'});
    }
});

router.get('/logout', function (req, res, next) {
    req.session.loggedin = false;
    res.redirect('/user/login');
});

module.exports = router;
